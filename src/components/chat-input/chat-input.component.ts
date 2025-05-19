import { Component, ViewChild, ElementRef, input, output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-chat-input",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./chat-input.component.html",
})
export class ChatInputComponent {
  form = input.required<FormGroup>();
  isStreaming = input(false);
  @ViewChild("promptInput") promptInput!: ElementRef<HTMLInputElement>;

  send = output<Event>();

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
