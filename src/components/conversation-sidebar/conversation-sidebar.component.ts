import { Component, EventEmitter, Output, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConversationService } from "@/services/conversation.service";
import { Conversation, ConversationGroup } from "@/types/conversation.types";
import { IconService } from "@/services/icon.service";

@Component({
  selector: "app-conversation-sidebar",
  standalone: true,
  imports: [CommonModule, IconService],
  templateUrl: "./conversation-sidebar.component.html",
  styleUrls: ["./conversation-sidebar.component.scss"],
})
export class ConversationSidebarComponent {
  @Output() conversationSelected = new EventEmitter<string>();
  @Output() createNewChat = new EventEmitter<string>();
  conversations = signal<ConversationGroup[]>([]);

  constructor(private conversationService: ConversationService) {
    this.loadConversations();
  }

  private loadConversations() {
    this.conversationService.getConversations().subscribe({
      next: (response) => {
        const grouped = this.groupConversations(response.conversations);
        this.conversations.set(grouped);
      },
      error: (error) => {
        console.error("Error loading conversations:", error);
      },
    });
  }

  private groupConversations(
    conversations: Conversation[]
  ): ConversationGroup[] {
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
      { title: "Today", conversations: [] },
      { title: "Yesterday", conversations: [] },
      { title: "Last 3 Days", conversations: [] },
      { title: "Last Week", conversations: [] },
      { title: "Last Month", conversations: [] },
      { title: "Last Year", conversations: [] },
      { title: "Older", conversations: [] },
    ];

    conversations.forEach((conversation) => {
      const updateDate = new Date(conversation.updatedAt);
      const updateDay = new Date(
        updateDate.getFullYear(),
        updateDate.getMonth(),
        updateDate.getDate()
      );

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
  }

  onConversationClick(conversation: Conversation) {
    console.log("Conversation clicked:", conversation.id);
    this.conversationSelected.emit(conversation.id);
  }
  onNewChatClick() {
    console.log("New chat clicked");
    this.createNewChat.emit();
  }
}
