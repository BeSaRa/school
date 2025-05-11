import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
  effect,
  ViewChild,
  AfterViewInit,
  ElementRef,
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
import { ConversationSidebarComponent } from "@/components/conversation-sidebar/conversation-sidebar.component";
import { ConversationService } from "@/services/conversation.service";
import { MarkdownModule } from "ngx-markdown";

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
    ConversationSidebarComponent,
    MarkdownModule,
  ],
  templateUrl: "./ai-chat-assistant.component.html",
})
export class AIChatAssistantComponent implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  readonly chatService = inject(ChatService);
  readonly conversationService = inject(ConversationService);

  @ViewChild(ChatInputComponent) chatInput!: ChatInputComponent;
  @ViewChild("messageContainer") messageContainer!: ElementRef;

  form: FormGroup;
  messages = this.chatService.messages;
  streamingAssistantContent = signal("");
  isStreaming = this.chatService.status;

  scrollInterval: any;
  scrollSpeed: number = 10;
  constructor() {
    this.form = this.fb.group({
      prompt: [
        { value: "", disabled: false },
        [Validators.required, Validators.minLength(1)],
      ],
    });

    effect(() => {
      const isStreaming = this.chatService.status();
      const control = this.form.get("prompt");
      if (control) {
        if (isStreaming) {
          control.disable();
        } else {
          control.enable();
          this.chatInput?.focus();
        }
      }
      if (isStreaming) {
        this.scrollInterval = setInterval(() => {
          const container = this.messageContainer.nativeElement;
          container.scrollTop += this.scrollSpeed;
        }, 10);
      } else {
        clearInterval(this.scrollInterval);
      }
    });
  }

  ngOnInit(): void {
    this.subscribeToMessages();
    this.subscribeToStreaming();
    this.chatService.startActionStream();
  }

  ngAfterViewInit(): void {
    this.chatInput?.focus();
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
    this.streamingAssistantContent.set("");

    try {
      this.chatService.sendMessage(userMessage).subscribe({
        error: (error) => {
          console.error("Error sending message:", error);
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
  onCreateNewChatClicked() {
    this.chatService.resetChat();
  }
  onConversationSelected(conversationId: string) {
    this.chatService.conversationId.set(conversationId);
    this.conversationService
      .getConversationMessages(conversationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.chatService.setMessages(response.messages);
          this.chatInput.focus();
        },
        error: (error) => {
          console.error("Error fetching conversation messages:", error);
        },
      });
  }
}
