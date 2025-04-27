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
  messages: string[] = [];

  private fb = inject(FormBuilder);
  private chatService = inject(ChatService);

  ngOnInit() {
    this.form = this.fb.group({
      prompt: ["", Validators.required],
    });
  }

  onEnter(event: Event) {
    event.preventDefault();
    this.sendMessage();
  }

  onSendClick() {
    this.sendMessage();
  }

  private sendMessage() {
    if (this.form.invalid) return;

    const userMessage = this.form.value.prompt;

    this.messages.push(`You: ${userMessage}`);
    this.messages.push("Assistant: ");

    this.chatService.sendMessage(userMessage).subscribe({
      next: (chunk) => {
        const lastIndex = this.messages.length - 1;

        // Ensure chunk is properly processed
        if (chunk && chunk.content) {
          // Append the assistant's content to the last message
          this.messages[lastIndex] += chunk.content;
        } else {
          console.error("Received chunk does not have content:", chunk);
        }
      },
      error: (err) => {
        console.error("Error:", err);
      },
      complete: () => {
        console.log("Streaming finished.");
      },
    });

    this.form.reset();
  }
}
