import { inject, Injectable, WritableSignal, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { UrlService } from "./url.service";
import { Message } from "@/models/message";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);

  messages: WritableSignal<Message[]> = signal<Message[]>([]);
  status: WritableSignal<boolean> = signal<boolean>(false);
  conversationId: WritableSignal<string> = signal<string>("");
  private messagesSubject = new Subject<Message[]>();
  private streamingAssistantSubject = new Subject<string>();

  getUrlSegment(): string {
    return this.urlService.URLS.AI_CHAT_ASSISTANT;
  }

  private getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }

  getMessages(): Observable<Message[]> {
    return this.messagesSubject.asObservable();
  }

  getStreamingAssistant(): Observable<string> {
    return this.streamingAssistantSubject.asObservable();
  }

  sendMessage(content: string): Observable<any> {
    const url = `${this.getUrlSegment()}`;
    const body = JSON.stringify({ prompt: content });
    const token = this.getAccessToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    this.messages.update((messages) => [
      ...messages,
      new Message(content, "user"),
    ]);
    this.messagesSubject.next(this.messages());
    this.status.set(true);

    return new Observable((observer) => {
      fetch(url, {
        method: "POST",
        headers,
        body,
      })
        .then((response) => {
          if (!response.body) throw new Error("No response body");

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          this.streamingAssistantSubject.next("");

          const read = async () => {
            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                if (buffer) {
                  this.messages.update((messages) => [
                    ...messages,
                    new Message(buffer, "assistant"),
                  ]);
                  this.messagesSubject.next(this.messages());
                }
                this.status.set(false);
                observer.complete();
                break;
              }

              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split("\n");

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  try {
                    const data = JSON.parse(line.slice(6));

                    if (data.role === "assistant") {
                      buffer += data.content || "";
                      this.streamingAssistantSubject.next(buffer);
                      observer.next(data);
                    }
                  } catch (error) {
                    console.error("Error parsing streamed data:", error);
                  }
                }
              }
            }
          };

          read();
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          this.status.set(false);
          observer.error(error);
        });
    });
  }

  resetChat() {
    this.messages.set([]);
    this.status.set(false);
    this.conversationId.set("");
    this.messagesSubject.next(this.messages());
  }
}
