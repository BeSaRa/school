import { Component, output, inject, OnInit, signal, model, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConversationService } from "@/services/conversation.service";
import { Conversation, ConversationGroup } from "@/types/conversation.types";
import { IconService } from "@/services/icon.service";
import { FormsModule } from "@angular/forms";
import { DialogService } from "../../services/dialog.service";
import { filter, switchMap } from "rxjs";
import { LocalService } from "@/services/local.service";
import { ChatService } from "@/services/ai-chat-assistant.service";

@Component({
  selector: "app-conversation-sidebar",
  standalone: true,
  imports: [CommonModule, IconService, FormsModule],
  templateUrl: "./conversation-sidebar.component.html",
  styleUrls: ["./conversation-sidebar.component.scss"],
})
export class ConversationSidebarComponent implements OnInit {
  conversationSelected = output<string>();
  createNewChat = output<void>();

  private rawConversations = signal<Conversation[]>([]);

  conversationService = inject(ConversationService);
  chatService = inject(ChatService);
  dialogService = inject(DialogService);
  localService = inject(LocalService);
  editingTitle = model<string>("");

  editingConversation = signal<string | null>(null);
  showContextMenu = signal<boolean>(false);
  contextMenuPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  selectedConversation: Conversation | null = null;

  groupLabels = computed(() => this.localService.locals());

  conversations = computed<ConversationGroup[]>(() => {
    const conversations = this.rawConversations();
    const labels = this.groupLabels();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const yearAgo = new Date(today);
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);

    const groups: ConversationGroup[] = [
      { title: labels.today, conversations: [] },
      { title: labels.yesterday, conversations: [] },
      { title: labels.last_3_days, conversations: [] },
      { title: labels.last_week, conversations: [] },
      { title: labels.last_month, conversations: [] },
      { title: labels.last_year, conversations: [] },
      { title: labels.older, conversations: [] },
    ];

    conversations.forEach((conversation) => {
      const updateDate = new Date(conversation.updatedAt);
      const updateDay = new Date(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate());

      if (updateDay.getTime() === today.getTime()) {
        groups[0].conversations.push(conversation);
      } else if (updateDay.getTime() === yesterday.getTime()) {
        groups[1].conversations.push(conversation);
      } else if (updateDay >= threeDaysAgo && updateDay < yesterday) {
        groups[2].conversations.push(conversation);
      } else if (updateDay >= weekAgo && updateDay < threeDaysAgo) {
        groups[3].conversations.push(conversation);
      } else if (updateDay >= monthAgo && updateDay < weekAgo) {
        groups[4].conversations.push(conversation);
      } else if (updateDay >= yearAgo && updateDay < monthAgo) {
        groups[5].conversations.push(conversation);
      } else {
        groups[6].conversations.push(conversation);
      }
    });

    return groups.filter((group) => group.conversations.length > 0);
  });

  ngOnInit(): void {
    this.loadConversations();

    this.chatService.newConversationCreated$.subscribe(() => {
      this.loadConversations();
    });
  }

  private loadConversations() {
    this.conversationService.getConversations().subscribe({
      next: (response) => {
        this.rawConversations.set(response.conversations);
      },
      error: (error) => {
        this.dialogService.error(this.localService.locals().error_loading_conversations, error.message).subscribe();
      },
    });
  }

  onConversationClick(conversation: Conversation) {
    this.conversationSelected.emit(conversation.id);
  }

  onNewChatClick() {
    this.createNewChat.emit();
  }

  onContextMenu(event: MouseEvent, conversation: Conversation) {
    event.preventDefault();
    this.selectedConversation = conversation;
    this.contextMenuPosition.set({ x: event.clientX, y: event.clientY });
    this.showContextMenu.set(true);
  }

  onEditConversation() {
    if (!this.selectedConversation) return;

    this.editingTitle.set(this.selectedConversation.title);
    this.editingConversation.set(this.selectedConversation.id);
    this.showContextMenu.set(false);

    setTimeout(() => {
      const inputElement = document.getElementById(`edit-${this.selectedConversation?.id}`);
      inputElement?.focus();
    });
  }

  submitEdit(conversationId: string) {
    const newTitle = this.editingTitle();
    if (!newTitle || newTitle === this.selectedConversation?.title) {
      this.cancelEdit();
      return;
    }

    this.conversationService.editConversationTitle(conversationId, newTitle).subscribe({
      next: () => {
        this.loadConversations();
        this.cancelEdit();
      },
      error: (error) => {
        this.dialogService.error(this.localService.locals().error_updating_conversation_title, error.message).subscribe();
        this.cancelEdit();
      },
    });
  }

  cancelEdit() {
    this.editingConversation.set(null);
    this.editingTitle.set("");
  }

  handleKeyDown(event: KeyboardEvent, conversationId: string) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.submitEdit(conversationId);
    } else if (event.key === "Escape") {
      event.preventDefault();
      this.cancelEdit();
    }
  }

  updateEditingTitle(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.editingTitle.set(value);
  }

  onDeleteConversation() {
    if (!this.selectedConversation) return;

    const item = this.localService.locals().conversation;

    this.dialogService
      .confirm(
        this.localService.interpolate("delete_item", { item }),
        this.localService.interpolate("delete_item_question", { item }),
        this.localService.locals().delete,
        this.localService.locals().cancel
      )
      .pipe(
        filter((result) => result.confirmed),
        switchMap(() => this.conversationService.deleteConversation(this.selectedConversation!.id))
      )
      .subscribe({
        next: () => {
          this.loadConversations();
          this.showContextMenu.set(false);
        },
        error: (error) => {
          this.dialogService.error(this.localService.interpolate("error_deleting_item", { item }), error.message).subscribe();
        },
      });
  }

  closeContextMenu() {
    this.showContextMenu.set(false);
    this.selectedConversation = null;
  }
}
