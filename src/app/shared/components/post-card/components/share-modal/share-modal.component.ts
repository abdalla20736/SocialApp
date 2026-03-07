import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Post } from '../../../../../core/models/posts/post.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-share-modal',
  imports: [FormsModule],
  templateUrl: './share-modal.component.html',
  styleUrl: './share-modal.component.css',
})
export class ShareModal {
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const container = event.target as HTMLElement;
    if (container instanceof HTMLElement && container.classList.contains('modal-overlay')) {
      this.onCancel();
    }
  }

  textareaContent: string = '';

  @Input() post!: Post;
  @Input() isDisabled: boolean = false;

  @Output() confirm = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(body: string): void {
    if (this.isDisabled) {
      return;
    }
    this.confirm.emit(body);
  }

  onCancel(): void {
    if (this.isDisabled) {
      return;
    }
    this.cancel.emit();
  }
}
