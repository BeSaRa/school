import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
  effect,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ChatService } from "@/services/ai-chat-assistant.service";
import { ChatMessageComponent } from "@/components/chat-message/chat-message.component";
import { ChatInputComponent } from "@/components/chat-input/chat-input.component";
import { Message } from "@/models/message";

/**
 * Component that provides the AI chat assistant interface
 * Handles user interactions and displays the chat conversation
 */
@Component({
  selector: "app-ai-chat-assistant",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    ChatInputComponent,
  ],
  templateUrl: "./ai-chat-assistant.component.html",
})
export class AiChatAssistantComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  readonly chatService = inject(ChatService);

  form: FormGroup;
  messages = this.chatService.messages;
  streamingAssistantContent = signal("");
  isStreaming = this.chatService.status;

  constructor() {
    this.form = this.fb.group({
      prompt: [
        { value: "", disabled: false },
        [Validators.required, Validators.minLength(1)],
      ],
    });

    // Subscribe to streaming state changes to update form control
    effect(() => {
      const isStreaming = this.chatService.status();
      const control = this.form.get("prompt");
      if (control) {
        if (isStreaming) {
          control.disable();
        } else {
          control.enable();
        }
      }
    });
  }

  ngOnInit(): void {
    this.subscribeToMessages();
    this.subscribeToStreaming();
  }

  private subscribeToMessages(): void {
    this.chatService
      .getMessages()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private subscribeToStreaming(): void {
    this.chatService
      .getStreamingAssistant()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((content) => {
        this.streamingAssistantContent.set(content);
      });
  }

  /**
   * Handles sending a new message
   * @param event - Optional event that triggered the send action
   */
  async handleSendMessage(event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
    }

    if (this.form.invalid || this.chatService.status()) {
      return;
    }

    const userMessage = this.form.value.prompt;
    this.form.reset();

    try {
      this.chatService.sendMessage(userMessage).subscribe({
        error: (error) => {
          console.error("Failed to send message:", error);
          // TODO: Add proper error handling UI
        },
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      // TODO: Add proper error handling UI
    }
  }

  /**
   * Resets the chat conversation
   */
  resetChat(): void {
    this.chatService.resetChat();
    this.form.reset();
  }
}
