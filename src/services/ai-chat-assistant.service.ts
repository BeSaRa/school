import { inject, Injectable, WritableSignal, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  catchError,
  defer,
  EMPTY,
  expand,
  filter,
  finalize,
  from,
  map,
  Observable,
  Subject,
  switchMap,
  takeWhile,
} from "rxjs";
import { UrlService } from "./url.service";
import { Message } from "@/models/message";
import { safeJsonParse } from "@/utils/utils";

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

    return defer(() =>
      from(fetch(url, { method: "POST", headers, body }))
    ).pipe(
      switchMap((response) => {
        if (!response.ok || !response.body) {
          throw new Error("Fetch failed or response has no body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        return from(reader.read()).pipe(
          expand(() => from(reader.read())),
          takeWhile(({ done }) => !done, true),
          map(({ value }) =>
            decoder.decode(value || new Uint8Array(), { stream: true })
          ),
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
          filter(
            (event): event is { type: string; data?: any } => event !== null
          ),
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
              this.messages.update((msgs) => [
                ...msgs,
                new Message(buffer, "assistant"),
              ]);
              this.messagesSubject.next(this.messages());
            }
            this.status.set(false);
          }),
          catchError((err) => {
            console.error("SSE error:", err);
            this.status.set(false);
            return EMPTY;
          })
        );
      })
    );
  }

  // private actions: WritableSignal<string[]> = signal<string[]>([]);
  // private latestAction: WritableSignal<string | null> = signal<string | null>(
  //   null
  // );
  // private actionsSubject = new Subject<string[]>();
  // private latestActionSubject = new Subject<string>();
  // private eventSource: EventSource | null = null;

  resetChat() {
    this.messages.set([]);
    this.status.set(false);
    this.conversationId.set("");
    this.messagesSubject.next(this.messages());
    // this.closeActionStream();
    // this.actions.set([]);
    // this.latestAction.set(null);
  }

  startActionStream(): void {
    // this.closeActionStream();
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
          throw new Error("ReadableStream not supported by the browser");
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
                this.messages.update((msgs) => [
                  ...msgs,
                  new Message(action, "tool"),
                ]);
                this.messagesSubject.next(this.messages());
                // this.actions.update((actions) => [...actions, action]);
                // this.actionsSubject.next(this.actions());
                // this.latestAction.set(action);
                // this.latestActionSubject.next(action);
              }
            }
            read();
          });
        };
        read();
      })
      .catch((err) => {
        console.error("Streaming fetch error:", err);
        // this.closeActionStream();
      });
  }

  // getActions(): Observable<string[]> {
  //   return this.actionsSubject.asObservable();
  // }

  // getLatestAction(): Observable<string> {
  //   return this.latestActionSubject.asObservable();
  // }

  // getCurrentActions(): string[] {
  //   return this.actions();
  // }

  // getCurrentLatestAction(): string | null {
  //   return this.latestAction();
  // }

  // closeActionStream(): void {
  //   if (this.eventSource) {
  //     this.eventSource.close();
  //     this.eventSource = null;
  //   }
  // }
}
