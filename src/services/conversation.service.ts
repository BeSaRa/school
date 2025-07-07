import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpContext } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UrlService } from "./url.service";
import { ConversationsResponse } from "@/types/conversation.types";
import { Message } from "@/models/message";
import { SKIP_LOADING } from "../tokens/loading-context.token";

@Injectable({
  providedIn: "root",
})
export class ConversationService {
  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);

  getUrlSegment(): string {
    return this.urlService.URLS.CONVERSATION;
  }

  getConversations(skip = 0, limit = 100): Observable<ConversationsResponse> {
    const url = `${this.getUrlSegment()}?skip=${skip}&limit=${limit}`;

    return this.http
      .get<ConversationsResponse>(url, {
        context: new HttpContext().set(SKIP_LOADING, true),
      })
      .pipe(
        map((response) => ({
          ...response,
          conversations: response.conversations.filter((conversation) => conversation.title).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
        }))
      );
  }

  getConversationMessages(conversationId: string): Observable<{ messages: Message[]; count: number }> {
    const url = `${this.getUrlSegment()}${conversationId}`;
    return this.http.get<{ messages: Message[]; count: number }>(url);
  }

  deleteConversation(conversationId: string): Observable<void> {
    const url = `${this.getUrlSegment()}${conversationId}`;
    return this.http.delete<void>(url);
  }

  editConversationTitle(conversationId: string, title: string): Observable<void> {
    const url = `${this.getUrlSegment()}${conversationId}`;
    return this.http.patch<void>(url, { title });
  }
}
