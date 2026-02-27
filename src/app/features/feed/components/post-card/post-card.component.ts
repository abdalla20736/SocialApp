import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Post } from '../../../../core/models/posts/post.model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/auth/user.model';
import { Observable } from 'rxjs';
import { initFlowbite } from 'flowbite';
import { PostService } from '../../../../core/services/post.service';
import { FormsModule } from '@angular/forms';
import { DeleteModal } from './components/delete-modal/delete-modal.component';
import { ShareModal } from './components/share-modal/share-modal.component';
import { PostImage } from './components/post-image/post-image.component';
import { TopComment } from './components/comment-card/top-comment/top-comment.component';
import { SharedPostCard } from './components/shared-post-card/shared-post-card.component';

@Component({
  selector: 'app-post-card',
  imports: [
    RouterLink,
    CommonModule,
    TimeagoModule,
    FormsModule,
    DeleteModal,
    ShareModal,
    TopComment,
    SharedPostCard,
    PostImage,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCard implements OnInit {
  private authService: AuthService = inject(AuthService);
  private postService = inject(PostService);
  private router = inject(Router);

  @Output() deletePostFromArray: EventEmitter<Post> = new EventEmitter<Post>();
  @Input() post?: Post;

  user: Observable<User | null> = this.authService.currentUser$;
  isShowedAllComments: boolean = false;
  userPhoto: string = '';
  userName: string = '';
  isSavingPost: boolean = false;
  privacy!: 'public' | 'following' | 'only_me';
  selectedDeletePostId: string = '';
  selectedSharePostId: string = '';
  selectedOverlayImageUrl: string = '';
  isModalConfirmed: boolean = false;
  postType: 'cover_photo' | 'profile_photo' | 'regular' = 'regular';

  ngOnInit(): void {
    initFlowbite();
    this.privacy = this.post?.privacy!;
    this.getPostType();
    console.log('PostCard initialized with post:', this.postType);
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

  getPostType(): void {
    if (this.post?.body?.includes('updated cover photo')) {
      this.postType = 'cover_photo';
    } else if (this.post?.body?.includes('updated profile photo')) {
      this.postType = 'profile_photo';
    } else {
      this.postType = 'regular';
    }
  }

  isUpdatedCoverPhoto(): boolean {
    return this.postType === 'cover_photo';
  }
  isUpdatedProfilePhoto(): boolean {
    return this.postType === 'profile_photo';
  }
  isRegularPost(): boolean {
    return this.postType === 'regular';
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

  expandImage(imgUrl: string) {
    this.selectedOverlayImageUrl = imgUrl;
  }
  closeImageOverlay(event: Event) {
    if (!(event.target instanceof HTMLImageElement) && (this.selectedOverlayImageUrl = '')) {
      this.selectedOverlayImageUrl = '';
    }
  }

  onPrivacyChange() {
    if (this.post?._id) {
      const formData = new FormData();
      formData.append('privacy', this.privacy);
      this.postService.updatePost(this.post._id, formData).subscribe({
        next: (updatedPost) => {
          this.post!.privacy = updatedPost.privacy;
        },
        error: (err) => {
          console.error('Failed to update post privacy:', err);
        },
      });
    }
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
        next: () => {
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
  onClickDeletePost(): void {
    this.selectedDeletePostId = this.post?._id || '';
    console.log(this.selectedDeletePostId);
  }

  onDeletePost(post: Post): void {
    this.deletePostFromArray.emit(post);
  }

  DeletePost() {
    if (this.selectedDeletePostId == '') return;
    this.isModalConfirmed = true;
    this.postService.deletePost(this.selectedDeletePostId).subscribe({
      next: () => {
        this.onDeletePost(this.post!);
        this.selectedDeletePostId = '';
        this.isModalConfirmed = false;
      },
      error: (err) => {
        console.error('Failed to delete post:', err);
        this.selectedDeletePostId = '';
      },
    });
  }
  CancelDelete() {
    this.selectedDeletePostId = '';
  }
  onClickSharePost(): void {
    this.selectedSharePostId = this.post?._id || '';
  }
  SharePost() {
    if (this.selectedSharePostId == '') return;
    this.isModalConfirmed = true;
    this.postService.sharePost(this.selectedSharePostId).subscribe({
      next: (sharedPost) => {
        console.log('Post shared successfully:', sharedPost);
        this.selectedSharePostId = '';
        this.isModalConfirmed = false;
      },
      error: (err) => {
        console.error('Failed to share post:', err);
        this.selectedSharePostId = '';
      },
    });
  }
  CancelShare() {
    this.selectedSharePostId = '';
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
