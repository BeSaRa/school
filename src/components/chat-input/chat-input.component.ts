import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
} from "@angular/core";
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
  @ViewChild("promptInput") promptInput!: ElementRef<HTMLInputElement>;

  @Output() send = new EventEmitter<Event>();

  focus(): void {
    setTimeout(() => {
      this.promptInput?.nativeElement.focus();
    });
  }

  onSubmit(): void {
    this.send.emit();
  }

  onEnter(event: Event): void {
    if (!this.isStreaming) {
      this.send.emit(event);
    }
  }
}
