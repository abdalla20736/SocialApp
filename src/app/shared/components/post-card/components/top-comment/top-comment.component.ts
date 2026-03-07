import { TopComment as TopCommentModel } from '../../../../../core/models/comments/comment-top.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../../../../core/models/posts/post.model';

@Component({
  selector: 'app-top-comment',
  imports: [],
  templateUrl: './top-comment.component.html',
  styleUrl: './top-comment.component.css',
})
export class TopComment {
  @Input() comment?: TopCommentModel;

  @Output() viewAllComments: EventEmitter<void> = new EventEmitter<void>();

  onViewAllComments(): void {
    this.viewAllComments.emit();
  }
}
