import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-chat-input",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./chat-input.component.html",
})
export class ChatInputComponent {
  @Input() form!: FormGroup;
  @Input() isStreaming = false;

  @Output() send = new EventEmitter<Event>();
  @Output() reset = new EventEmitter<void>();

  onSubmit(): void {
    this.send.emit();
  }

  onEnter(event: Event): void {
    if (!this.isStreaming) {
      this.send.emit(event);
    }
  }

  onReset(): void {
    this.reset.emit();
  }
}
