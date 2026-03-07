import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Post } from '../../../../../../core/models/posts/post.model';
import { FormsModule } from '@angular/forms';
import { CommentCard } from '../components/comment-card/comment-card/comment-card.component';
import { Comment } from '../../../../../../core/models/comments/comment.model';
import { EmptyComments } from '../components/empty-comments/empty-comments.component';
import { CommentReplyCreator } from '../components/comment-reply-creator/comment-reply-creator.component';
import { CommentReplyForm } from '../../../../../../core/models/comments/comment-reply-form.model';

@Component({
  selector: 'app-comments-container',
  imports: [FormsModule, CommentCard, EmptyComments, CommentReplyCreator],
  templateUrl: './comments-container.component.html',
  styleUrl: './comments-container.component.css',
})
export class CommentsContainer {
  @Input() post!: Post;
  @Input() comments!: Comment[];
  @Input() isSubmittingComment: boolean = false;
  @Input() isUpdateingCommentSet!: Set<string>;
  @Input() isLoadingComments: boolean = false;
  @Input() isCommentLikesSet!: Set<string>;

  @Output() submitComment: EventEmitter<CommentReplyForm> = new EventEmitter<CommentReplyForm>();
  @Output() likeComment = new EventEmitter<string>();
  @Output() replyToComment = new EventEmitter<string>();
  @Output() deleteComment = new EventEmitter<string>();
  @Output() updateComment = new EventEmitter<{ id: string; content: string }>();

  selectedViewedComments: string = 'most-relevant';

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['isLoadingComments']) return;

    const isWasLoading = changes['isLoadingComments'].previousValue === true;
    const isIsLoadingNow = changes['isLoadingComments'].currentValue === true;
    if (isWasLoading && !isIsLoadingNow) {
      this.onChangeViewedComments();
    }
  }

  onSubmitComment(payload: CommentReplyForm): void {
    this.submitComment.emit(payload);
  }

  onChangeViewedComments(): void {
    switch (this.selectedViewedComments) {
      case 'most-relevant':
        this.comments = this.comments.sort((a, b) => {
          const aLikes = a.likes ? a.likes.length : 0;
          const bLikes = b.likes ? b.likes.length : 0;
          return bLikes - aLikes;
        });
        break;
      case 'newest':
        this.comments = this.comments.sort(
          (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
        );
        break;
    }
  }

  onLikeComment(commentId: string): void {
    this.likeComment.emit(commentId);
  }

  onReplyToComment(commentId: string): void {
    this.replyToComment.emit(commentId);
  }

  onDeleteComment(commentId: string): void {
    this.deleteComment.emit(commentId);
  }

  onUpdateComment(payload: { id: string; content: string }): void {
    this.updateComment.emit(payload);
  }
}
