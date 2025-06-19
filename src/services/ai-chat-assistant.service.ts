import { inject, Injectable, WritableSignal, signal } from "@angular/core";
import { catchError, defer, EMPTY, expand, filter, finalize, from, map, Observable, Subject, switchMap, takeWhile } from "rxjs";
import { UrlService } from "./url.service";
import { Message } from "@/models/message";
import { safeJsonParse } from "@/utils/utils";
import { ConversationService } from "./conversation.service";
import { DialogService } from "./dialog.service";
import { LocalService } from "./local.service";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private readonly conversationService = inject(ConversationService);
  private readonly urlService = inject(UrlService);
  private readonly dialogService = inject(DialogService);
  private readonly localService = inject(LocalService);

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

  setMessages(messages: Message[]) {
    this.messages.set(messages);
  }

  getStreamingAssistant(): Observable<string> {
    return this.streamingAssistantSubject.asObservable();
  }

  sendMessage(content: string, conversationId?: string): Observable<any> {
    const url = `${this.getUrlSegment()}?nocache=true&auto_set_title=true`;
    const token = this.getAccessToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const body = JSON.stringify({
      prompt: content,
      conversationId: conversationId || this.conversationId(),
    });

    this.messages.update((msgs) => [...msgs, new Message(content, "user")]);
    this.messagesSubject.next(this.messages());
    this.status.set(true);

    let buffer = "";

    return defer(() => from(fetch(url, { method: "POST", headers, body }))).pipe(
      switchMap((response) => {
        if (!response.ok || !response.body) {
          this.dialogService.error(this.localService.locals().error_request_failed, "Unable to connect or empty response.").subscribe();
          this.status.set(false);
          return EMPTY;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        return from(reader.read()).pipe(
          expand(() => from(reader.read())),
          takeWhile(({ done }) => !done, true),
          map(({ value }) => decoder.decode(value || new Uint8Array(), { stream: true })),
          map((chunk) =>
            chunk
              .split("\n")
              .filter((line) => line.startsWith("data: "))
              .map((line) => line.slice(6))
          ),
          switchMap((jsons) => from(jsons)),
          map((json) => {
            if (json === "[DONE]") return { type: "done" };

            const data = safeJsonParse(json);

            if (data.event === "metadata") {
              return { type: "metadata", data };
            }
            if (data.role === "assistant") {
              return { type: "content", data };
            }
            return { type: "unknown", data };
          }),
          filter((event): event is { type: string; data?: any } => event !== null),
          map((event) => {
            if (event.data?.conversationId) {
              this.conversationId.set(event.data.conversationId);
            }
            if (event.type === "content") {
              buffer += event.data.content || "";
              this.streamingAssistantSubject.next(buffer);
            }
            return event;
          }),
          finalize(() => {
            if (buffer) {
              this.messages.update((msgs) => [...msgs, new Message(buffer, "assistant")]);
              this.messagesSubject.next(this.messages());
            }
            this.status.set(false);
          }),
          catchError((error) => {
            this.dialogService.error(this.localService.locals().error_streaming, error.message).subscribe();
            this.status.set(false);
            return EMPTY;
          })
        );
      }),
      catchError((error) => {
        this.dialogService.error(this.localService.locals().error_unexpected, error.message).subscribe();
        this.status.set(false);
        return EMPTY;
      })
    );
  }

  resetChat() {
    this.messages.set([]);
    this.status.set(false);
    this.conversationId.set("");
    this.messagesSubject.next(this.messages());
    this.conversationService.getConversations();
  }

  startActionStream(): void {
    const token = this.getAccessToken();
    const url = `${this.getUrlSegment()}actions`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        Connection: "keep-alive",
        "X-Client": "web",
      },
    })
      .then((response) => {
        if (!response.body) {
          this.dialogService.error(this.localService.locals().unsupported_feature, "Streaming not supported by your browser.").subscribe();
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        const read = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              console.log("Stream closed by server");
              // this.closeActionStream();
              return;
            }

            buffer += decoder.decode(value, { stream: true });
            let lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data:")) {
                const action = line.replace("data:", "").trim();
                if (action.includes("connected to actions SSE stream")) {
                  continue;
                }
                this.messages.update((msgs) => [...msgs, new Message(action, "tool")]);
                this.messagesSubject.next(this.messages());
              }
            }

            read();
          });
        };

        read();
      })
      .catch(() => {
        this.dialogService.error(this.localService.locals().connection_error, "An error occurred while connecting to the server.").subscribe();
      });
  }
}
