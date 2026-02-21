import { Component, inject, Input, OnInit } from '@angular/core';
import { Post } from '../../../core/models/posts/post.model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth/user.model';
import { Observable } from 'rxjs';
import { initFlowbite } from 'flowbite';
import { PostService } from '../../../core/services/post.service';
@Component({
  selector: 'app-post-card',
  imports: [RouterLink, CommonModule, TimeagoModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCard implements OnInit {
  private authService: AuthService = inject(AuthService);
  private postService = inject(PostService);
  private router = inject(Router);

  @Input() post?: Post;

  user: Observable<User | null> = this.authService.currentUser$;
  isShowedAllComments: boolean = false;
  userPhoto: string = '';
  userName: string = '';
  isSavingPost: boolean = false;

  ngOnInit(): void {
    initFlowbite();
  }

  ngAfterContentInit(): void {
    if (this.post?.user?.photo) {
      this.userPhoto = this.post.user.photo;
      this.userName = this.post.user.name;
    } else {
      this.user.subscribe((user) => {
        if (user) {
          this.userPhoto = user.photo;
          this.userName = user.name;
        }
      });
    }
  }

  isPostOwner(): boolean {
    const currentUser = this.authService.getCurrentUser();
    return this.post?.user?._id === currentUser?._id;
  }
  isPostSaved(): boolean {
    return this.post?.bookmarked || false;
  }
  isPostLikedByCurrentUser(): boolean {
    return this.post?.likes.some((likedUserId) => likedUserId === this.post?.user?._id) || false;
  }

  openPost() {
    this.router.navigate(['/post', this.post?._id]);
  }

  toggleBookmarkPost(): void {
    this.isSavingPost = true;
    if (this.post?._id) {
      const previousBookmarkState = this.post.bookmarked;
      this.post.bookmarked = !previousBookmarkState;
      this.postService.bookmarkPost(this.post._id).subscribe({
        next: (updatedBookmark) => {
          this.post!.bookmarked = updatedBookmark.bookmarked;
          this.isSavingPost = false;
        },
        error: (err) => {
          console.error('Failed to bookmark post:', err);
          this.post!.bookmarked = previousBookmarkState;
          this.isSavingPost = false;
        },
      });
    }
  }

  toggleLikePost(): void {
    this.isSavingPost = true;
    const previousLikeState = this.isPostLikedByCurrentUser();
    if (this.post?.likes && this.post?.user?._id) {
      const userLikeIndex = this.post.likes.findIndex(
        (likedUserId) => likedUserId === this.post?.user?._id,
      );
      if (userLikeIndex > -1) {
        this.post.likes.splice(userLikeIndex, 1);
        this.post.likesCount--;
      } else {
        this.post.likes.push(this.post.user._id);
        this.post.likesCount++;
      }
    }
    if (this.post?._id) {
      this.postService.likePost(this.post._id).subscribe({
        next: (updatedPost) => {
          this.isSavingPost = false;
        },
        error: (err) => {
          console.error('Failed to like post:', err);
          this.isSavingPost = false;
          if (previousLikeState) {
            if (this.post?.likes && this.post?.user?._id) {
              const userLikeIndex = this.post.likes.findIndex(
                (likedUserId) => likedUserId === this.post?.user?._id,
              );
              if (userLikeIndex > -1) {
                this.post.likes.splice(userLikeIndex, 1);
                this.post.likesCount--;
              } else {
                this.post.likes.push(this.post.user._id);
                this.post.likesCount++;
              }
            } else {
              this.post?.likes.push(this.post?.user?._id || '');
              this.post!.likesCount++;
            }
          }
        },
      });
    }
  }

  toggleShowAllComments(): void {
    this.isShowedAllComments = !this.isShowedAllComments;
  }

  getRemainingCommentsCount(): number {
    const commentsCount = this.post?.commentsCount || 0;
    return commentsCount >= 3 ? commentsCount - 3 : 0;
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  }
}
