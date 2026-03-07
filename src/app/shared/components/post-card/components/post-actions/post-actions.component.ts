import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../../../../core/models/posts/post.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-actions',
  imports: [CommonModule],
  templateUrl: './post-actions.component.html',
  styleUrl: './post-actions.component.css',
})
export class PostActions {
  @Input() post!: Post;
  @Input() isShowedAllComments: boolean = false;
  @Input() isLoadingComments: boolean = false;
  @Input() isPostLikedByOwner: boolean = false;
  @Output() likeButtonAction = new EventEmitter<void>();
  @Output() commentButtonAction = new EventEmitter<void>();
  @Output() shareButtonAction = new EventEmitter<void>();

  onLikeButtonAction(): void {
    this.likeButtonAction.emit();
  }

  onCommentButtonAction(): void {
    this.commentButtonAction.emit();
  }

  onShareButtonAction(): void {
    this.shareButtonAction.emit();
  }
}
