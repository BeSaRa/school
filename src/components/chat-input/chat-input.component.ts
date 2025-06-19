import { Component, ViewChild, ElementRef, input, output, inject } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { LocalService } from "@/services/local.service";
import { IconService } from "../../services/icon.service";

@Component({
  selector: "app-chat-input",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconService],
  templateUrl: "./chat-input.component.html",
})
export class ChatInputComponent {
  form = input.required<FormGroup>();
  isStreaming = input(false);
  isFirstMessage = input(true);
  @ViewChild("promptInput") promptInput!: ElementRef<HTMLInputElement>;

  send = output<Event>();
  localService = inject(LocalService);
  focus(): void {
    setTimeout(() => {
      this.promptInput?.nativeElement.focus();
    });
  }

  onSubmit(event: Event): void {
    this.send.emit(event);
  }

  onEnter(event: Event): void {
    if (!this.isStreaming()) {
      this.send.emit(event);
    }
  }
}
