import { Post } from '../../../core/models/posts/post.model';
import { Component, inject, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { PostCard } from '../components/post-card/post-card.component';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { PostSkeleton } from '../components/post-skeleton/post-skeleton.component';
import { SocialSidebar } from '../components/social-sidebar/social-sidebar.component';
import { FilterSidebar } from '../components/filter-sidebar/filter-sidebar.component';
import { User } from '../../../core/models/auth/user.model';
import { PostsFilter } from '../../../shared/types/post-filter.type';
import { CreatePost } from '../components/create-post/create-post.component';

@Component({
  selector: 'app-feed',
  imports: [PostCard, FormsModule, PostSkeleton, SocialSidebar, FilterSidebar, CreatePost],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class Feed implements OnInit {
  private authService: AuthService = inject(AuthService);
  private postService = inject(PostService);

  posts: Post[] = [];
  user: User = this.authService.getCurrentUser();
  isLoading: boolean = true;
  selectedPostsFilter: PostsFilter = 'feed';

  get filteredPosts() {
    switch (this.selectedPostsFilter) {
      case 'my-posts':
        return this.posts.filter((post) => post.user?._id === this.user._id);
      case 'community':
        return this.posts
          .filter((post) => post.privacy === 'public')
          .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });
      case 'saved':
        return this.posts.filter((post) => post.bookmarked);
      default:
        return this.posts;
    }
  }

  ngOnInit(): void {
    this.loadHomeFeed();
  }

  unshiftPost(newPost: Post): void {
    this.posts.unshift(newPost);
  }

  deletePostFromArray(postToDelete: Post): void {
    this.posts = this.posts.filter((post) => post._id !== postToDelete._id);
  }

  updatePostInArray(updatedPost: Post): void {
    const index = this.posts.findIndex((post) => post._id === updatedPost._id);
    if (index !== -1) {
      this.posts[index] = updatedPost;
    }
  }

  loadHomeFeed(): void {
    this.postService.getHomeFeed().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        this.posts = [];
        this.isLoading = false;
      },
    });
  }

  setFilter(filter: PostsFilter): void {
    this.selectedPostsFilter = filter;
  }
}
