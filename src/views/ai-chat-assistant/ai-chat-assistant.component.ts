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
  OnDestroy,
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
import { DialogService } from "../../services/dialog.service";
import { UserService } from "@/services/user.service";
import { Subscription } from "rxjs";
import { IconService } from "@/services/icon.service";
import { User } from "@/models/user";
import { LocalService } from "@/services/local.service";

@Component({
  selector: "app-ai-chat-assistant",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    ChatInputComponent,
    ConversationSidebarComponent,
    IconService,
  ],
  templateUrl: "./ai-chat-assistant.component.html",
})
export class AIChatAssistantComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  // Injected services
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  readonly chatService = inject(ChatService);
  readonly dialogService = inject(DialogService);
  readonly conversationService = inject(ConversationService);
  readonly userService = inject(UserService);
  readonly localService = inject(LocalService);

  // ViewChild references
  @ViewChild(ChatInputComponent) chatInput!: ChatInputComponent;
  @ViewChild("messageContainer") messageContainer!: ElementRef<HTMLDivElement>;

  // Component properties
  form: FormGroup;
  messages = this.chatService.messages;
  streamingAssistantContent = signal("");
  isStreaming = this.chatService.status;
  currentUser: User | null = null;
  showSidebar = signal(false);

  // Scroll properties
  private scrollInterval: number | null = null;
  private readonly scrollSpeed = 10;
  private userSubscription?: Subscription;

  constructor() {
    this.form = this.fb.group({
      prompt: [
        { value: "", disabled: false },
        [Validators.required, Validators.minLength(1)],
      ],
    });

    // Effect to handle streaming state changes
    effect(() => {
      this.handleStreamingStateChange(this.chatService.status());
    });
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngAfterViewInit(): void {
    this.focusInput();
  }

  ngOnDestroy(): void {
    this.cleanupResources();
  }

  /**
   * Initializes the component by setting up subscriptions and loading data
   */
  private initializeComponent(): void {
    this.subscribeToMessages();
    this.subscribeToStreaming();
    this.loadUserData();
    this.chatService.startActionStream();
  }

  /**
   * Loads the current user data
   */
  private loadUserData(): void {
    // First try to get the current user directly
    this.currentUser = this.userService.currentUser;

    // If not available, subscribe to the user observable
    if (!this.currentUser) {
      this.userSubscription = this.userService.currentUser$.subscribe(
        (user) => {
          this.currentUser = user;
        }
      );
    }
  }

  /**
   * Subscribes to message updates from the chat service
   */
  private subscribeToMessages(): void {
    this.chatService
      .getMessages()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * Subscribes to streaming content updates from the chat service
   */
  private subscribeToStreaming(): void {
    this.chatService
      .getStreamingAssistant()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((content) => {
        this.streamingAssistantContent.set(content);
      });
  }

  /**
   * Handles changes in the streaming state
   * @param isStreaming - Whether the chat is currently streaming
   */
  private handleStreamingStateChange(isStreaming: boolean): void {
    const control = this.form.get("prompt");

    if (control) {
      if (isStreaming) {
        control.disable();
        this.startAutoScroll();
      } else {
        control.enable();
        this.stopAutoScroll();
        this.focusInput();
      }
    }
  }

  /**
   * Starts auto-scrolling the message container
   */
  private startAutoScroll(): void {
    this.stopAutoScroll(); // Ensure no duplicate intervals

    this.scrollInterval = window.setInterval(() => {
      const container = this.messageContainer.nativeElement;
      container.scrollTop += this.scrollSpeed;
    }, 10);
  }

  /**
   * Stops auto-scrolling the message container
   */
  private stopAutoScroll(): void {
    if (this.scrollInterval !== null) {
      window.clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }

  /**
   * Focuses the chat input field
   */
  private focusInput(): void {
    this.chatInput?.focus();
  }

  /**
   * Cleans up resources when the component is destroyed
   */
  private cleanupResources(): void {
    this.stopAutoScroll();

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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

    this.chatService.sendMessage(userMessage).subscribe({
      error: (error) => {
        this.handleMessageError(error);
      },
    });
  }

  /**
   * Handles errors that occur when sending messages
   * @param error - The error that occurred
   */
  private handleMessageError(error: any): void {
    this.dialogService
      .error("An error occurred while sending the message.", error)
      .subscribe();
  }

  /**
   * Creates a new chat conversation
   */
  onCreateNewChatClicked(): void {
    this.showSidebar.set(false);
    this.chatService.resetChat();
  }

  /**
   * Loads a selected conversation
   * @param conversationId - The ID of the conversation to load
   */
  onConversationSelected(conversationId: string): void {
    this.showSidebar.set(false);
    this.chatService.conversationId.set(conversationId);

    this.conversationService
      .getConversationMessages(conversationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.chatService.setMessages(response.messages);
          this.focusInput();
        },
        error: (error) => {
          this.handleConversationLoadError(error);
        },
      });
  }

  /**
   * Handles errors that occur when loading conversations
   * @param error - The error that occurred
   */
  private handleConversationLoadError(error: any): void {
    this.dialogService
      .error("An error occurred while loading the conversation.", error)
      .subscribe();
  }

  /**
   * Toggles the sidebar visibility on mobile devices
   */
  toggleSidebar(): void {
    this.showSidebar.update((value) => !value);
  }
}
