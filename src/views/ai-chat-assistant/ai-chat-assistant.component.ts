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

  private fb = inject(FormBuilder);
  private chatService = inject(ChatService);

  ngOnInit() {
    this.form = this.fb.group({
      prompt: ["", Validators.required],
    });

    // Subscribe to the messages observable
    this.chatService.getMessages().subscribe((messages) => {
      this.messages = messages;
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
    this.chatService.sendMessage(userMessage).subscribe({
      next: () => {},
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
