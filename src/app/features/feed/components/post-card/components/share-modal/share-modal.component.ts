import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Post } from '../../../../../../core/models/posts/post.model';

@Component({
  selector: 'app-share-modal',
  imports: [],
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

  @Input() post!: Post;
  @Input() isDisabled: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    if (this.isDisabled) {
      return;
    }
    this.confirm.emit();
  }

  onCancel(): void {
    if (this.isDisabled) {
      return;
    }
    this.cancel.emit();
  }
}
