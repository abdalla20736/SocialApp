import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-form',
  imports: [FormsModule],
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.css',
})
export class EditForm {
  @Input() isPost: boolean = false;
  @Input() entityId!: string;
  @Input() content!: string;
  @Input() isUpdating: boolean = false;

  @Output() update = new EventEmitter<{ id: string; content: string }>();
  @Output() cancelEdit = new EventEmitter<void>();

  editedContent: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['isUpdating'];
    if (!change) return;

    const wasUpdating = change.previousValue === true;
    const isUpdatingNow = change.currentValue === true;

    if (wasUpdating && !isUpdatingNow) {
      Promise.resolve().then(() => this.onCancelEdit());
    }
  }

  ngOnInit(): void {
    this.editedContent = this.content.trim();
  }

  onCancelEdit(): void {
    this.cancelEdit.emit();
  }

  onUpdate(): void {
    if (this.isUpdating) return;

    const trimmedContent = this.editedContent?.trim() ?? '';
    if (!trimmedContent) return;

    this.editedContent = trimmedContent;
    this.update.emit({ id: this.entityId, content: trimmedContent });
  }
}
