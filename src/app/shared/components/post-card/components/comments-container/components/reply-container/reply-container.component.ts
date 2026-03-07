import { Component, inject, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { Reply } from '../../../../../../../core/models/replies/reply.model';
import { ReplyService } from '../../../../../../../core/services/reply.service';
import { CommentReplyForm } from '../../../../../../../core/models/comments/comment-reply-form.model';
import { finalize } from 'rxjs';
import { CommentReplyCreator } from '../comment-reply-creator/comment-reply-creator.component';
import { CommentCard } from '../comment-card/comment-card/comment-card.component';
import { Post } from '../../../../../../../core/models/posts/post.model';
import { CommentService } from '../../../../../../../core/services/comment.service';
import { AuthService } from '../../../../../../../core/services/auth.service';
import { DeleteModalService } from '../../../../../../../core/services/delete-modal.service';

@Component({
  selector: 'app-reply-container',
  imports: [CommentReplyCreator, forwardRef(() => CommentCard)],
  templateUrl: './reply-container.component.html',
  styleUrl: './reply-container.component.css',
})
export class ReplyContainer {
  private readonly replyService: ReplyService = inject(ReplyService);
  private readonly commentService: CommentService = inject(CommentService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly deleteModalService: DeleteModalService = inject(DeleteModalService);

  @Input() post!: Post;
  @Input() commentId: string = '';
  @Input() commenterPhotoUrl!: string;
  @Input() commenterName!: string;
  @Input() repliesCount!: number;
  @Input() replies!: Reply[];
  @Input() isLoadingReplies: boolean = false;
  @Input() isReplyLikesSet: Set<string> = new Set<string>();
  @Input() isUpdatingRepliesSet: Set<string> = new Set<string>();

  isSubmittingReply: boolean = false;
  isDeleting$ = this.deleteModalService.getIsDeleting();

  onConfirmDeleteReply = (replyId: string) => {
    return () => this.deleteReply(replyId);
  };

  openDeleteModal(id: string): void {
    this.deleteModalService.setDeleteModal('reply', id, this.onConfirmDeleteReply(id));
  }

  closeDeleteModal(): void {
    this.deleteModalService.closeModal();
  }

  onSubmitReply(payload: CommentReplyForm): void {
    this.isSubmittingReply = true;
    this.replyService
      .createReply(this.post._id, this.commentId, payload.content, payload.image)
      .pipe(finalize(() => (this.isSubmittingReply = false)))
      .subscribe({
        next: (reply) => {
          this.replies.push(reply);
        },
        error: () => {
          console.log('Failed to submit reply');
        },
      });
  }

  onLikeReply(replyId: string): void {
    this.isReplyLikesSet.add(replyId);
    this.commentService
      .toggleCommentLike(this.post._id, replyId)
      .pipe(finalize(() => this.isReplyLikesSet.delete(replyId)))
      .subscribe({
        next: () => {
          const index = this.replies.findIndex((r) => r._id === replyId);
          if (index !== -1) {
            const user = this.authService.getCurrentUser();
            if (user) {
              const likeIndex = this.replies[index].likes.findIndex((id) => id === user._id);
              if (likeIndex !== -1) {
                this.replies[index].likes.splice(likeIndex, 1);
              } else {
                this.replies[index].likes.push(user._id);
              }
            }
          }
        },
        error: (err) => {
          console.error('Failed to like reply:', err);
        },
      });
  }

  onUpdateReply(payload: { id: string; content: string }): void {
    const { id, content } = payload;

    this.isUpdatingRepliesSet.add(id);
    this.commentService
      .updateComment(this.post._id, id, content)
      .pipe(finalize(() => this.isUpdatingRepliesSet.delete(id)))
      .subscribe({
        next: (updatedReply) => {
          const index = this.replies.findIndex((reply) => reply._id === id);
          if (index !== -1) {
            this.replies[index].content = updatedReply.content;
          }
        },
        error: (err) => {
          console.error('Failed to update reply:', err);
        },
      });
  }

  deleteReply(replyId: string): void {
    this.deleteModalService.setDeleting(true);
    this.commentService.deleteComment(this.post._id, replyId).subscribe({
      next: () => {
        this.replies = this.replies.filter((reply) => reply._id !== replyId);
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Failed to delete reply:', err);
        this.closeDeleteModal();
      },
    });
  }
}
