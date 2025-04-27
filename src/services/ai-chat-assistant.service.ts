import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, switchMap, catchError, of } from "rxjs";
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

  getUrlSegment(): string {
    return this.urlService.URLS.AI_CHAT_ASSISTANT;
  }

  // Method to get the access token from localStorage
  private getAccessToken(): string | null {
    return localStorage.getItem("access_token");
  }

  sendMessage(content: string): Observable<any> {
    const url = `${this.getUrlSegment()}`;
    const body = { prompt: content };
    const params = new HttpParams()
      .set("nocache", "false")
      .set("auto_set_title", "true");

    // Update the chat with the user's message
    this.messages.update((messages) => [
      ...messages,
      new Message(content, "user"),
    ]);
    this.status.set(true);

    // Get the access token
    const token = this.getAccessToken();

    // Add authorization header if the token exists
    const headers = token
      ? new HttpHeaders().set("Authorization", `Bearer ${token}`)
      : new HttpHeaders();

    // Use HttpClient to send a POST request
    return this.http
      .post(url, body, {
        params,
        headers,
        responseType: "text", // Assuming text/event-stream is handled by client-side
      })
      .pipe(
        switchMap((response: string) => {
          // Process the response and stream data if necessary
          let assistantMessage = new Message("", "assistant");
          this.messages.update((messages) => [...messages, assistantMessage]);

          // Handling SSE stream logic
          return new Observable((observer) => {
            const processStream = async () => {
              try {
                const reader = new TextDecoder();
                const lines = response.split("\n");

                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    try {
                      const data = JSON.parse(line.slice(6));
                      if (data.role === "assistant") {
                        assistantMessage = new Message(
                          assistantMessage.content + (data.content || ""),
                          "assistant"
                        );
                        this.messages.update((messages) => {
                          messages[messages.length - 1] = assistantMessage;
                          return messages;
                        });
                        observer.next(data);
                      }
                    } catch (error) {
                      console.error("Error parsing SSE data:", error);
                    }
                  }
                }

                this.status.set(false);
                observer.complete();
              } catch (error) {
                this.status.set(false);
                observer.error(error);
              }
            };

            processStream();
          });
        }),
        catchError((error) => {
          console.error("Error sending message:", error);
          this.status.set(false);
          return of(null);
        })
      );
  }

  resetChat() {
    this.messages.set([]);
    this.status.set(false);
    this.conversationId.set("");
  }
}
