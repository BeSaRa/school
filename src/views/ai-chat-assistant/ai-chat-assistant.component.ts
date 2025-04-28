import { Message } from "@/models/message";
import { ChatService } from "@/services/ai-chat-assistant.service";
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-ai-chat-assistant",
  standalone: true,
  templateUrl: "./ai-chat-assistant.component.html",
  imports: [ReactiveFormsModule, CommonModule],
})
export class AiChatAssistantComponent implements OnInit {
  form!: FormGroup;
  messages: Message[] = [];
  messageBuffer = "";
  private eventSource: EventSource | null = null;

  private fb = inject(FormBuilder);
  private chatService = inject(ChatService);

  ngOnInit() {
    this.form = this.fb.group({
      prompt: ["", Validators.required],
    });

    // Subscribe to the messages
    this.chatService.getMessages().subscribe((messages) => {
      this.messages = messages;
    });

    // Subscribe to the streaming assistant updates
    this.chatService.getStreamingAssistant().subscribe((buffer) => {
      this.messageBuffer = buffer; // Update the buffer in real-time
    });
  }

  trackByFn(index: number, item: Message): any {
    return item.content;
  }

  onEnter(event: Event) {
    event.preventDefault();
    this.sendMessage();
  }

  onSendClick() {
    this.sendMessage();
  }

  private async sendMessage() {
    if (this.form.invalid) return;

    const userMessage = this.form.value.prompt;

    if (this.eventSource) {
      this.eventSource.close();
    }

    try {
      const url = `${this.chatService.getUrlSegment()}`;
      const token = localStorage.getItem("access_token");

      // Add user message to the chat
      this.messages = [...this.messages, new Message(userMessage, "user")];

      // Make initial request with headers
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.role === "assistant") {
                this.messageBuffer += data.content;

                const lastMessage = this.messages[this.messages.length - 1];
                if (lastMessage?.role === "assistant") {
                  lastMessage.content = this.messageBuffer;
                } else {
                  this.messages = [
                    ...this.messages,
                    new Message(this.messageBuffer, "assistant"),
                  ];
                }
              }
            } catch (error) {
              console.error("Error parsing stream data:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.form.reset();
    }
  }

  ngOnDestroy() {
    if (this.eventSource) {
      this.eventSource.close();
    }
  }
}
