import { Post } from '../../../core/models/posts/post.model';
import { Component, inject, OnInit } from '@angular/core';
import { PostCard } from '../../../shared/components/post-card/post-card/post-card.component';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { PostSkeleton } from '../components/post-skeleton/post-skeleton.component';
import { SocialSidebar } from '../components/social-sidebar/social-sidebar.component';
import { FilterSidebar } from '../components/filter-sidebar/filter-sidebar/filter-sidebar.component';
import { User } from '../../../core/models/auth/user.model';
import { PostsFilter } from '../../../shared/types/post-filter.type';
import { CreatePost } from '../components/create-post/create-post.component';
import { UserService } from '../../../core/services/user.service';
import { DeleteModalService } from '../../../core/services/delete-modal.service';

@Component({
  selector: 'app-feed',
  imports: [PostCard, FormsModule, PostSkeleton, SocialSidebar, FilterSidebar, CreatePost],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class Feed implements OnInit {
  private authService: AuthService = inject(AuthService);
  private postService: PostService = inject(PostService);
  private userService: UserService = inject(UserService);
  private readonly deleteModalService: DeleteModalService = inject(DeleteModalService);
  private feedCache = new Map<PostsFilter, Post[]>();

  posts: Post[] = [];
  user: User = this.authService.getCurrentUser();
  isLoading: boolean = true;
  selectedFilter: PostsFilter = 'following';

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

  loadHomeFeed(filter: PostsFilter = 'following'): void {
    if (this.feedCache.has(filter)) {
      this.posts = this.feedCache.get(filter)!;
      return;
    }
    this.isLoading = true;
    this.postService.getFilteredHomeFeed(filter).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.feedCache.set(filter, posts);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        this.posts = [];
        this.isLoading = false;
      },
    });
  }

  loadBookmarks(): void {
    if (this.feedCache.has('bookmarks')) {
      this.posts = this.feedCache.get('bookmarks')!;
      return;
    }
    this.isLoading = true;
    this.userService.getBookMarksPosts().subscribe({
      next: (bookmarks) => {
        this.posts = bookmarks;
        this.feedCache.set('bookmarks', bookmarks);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load bookmarks:', err);
        this.posts = [];
        this.isLoading = false;
      },
    });
  }

  setFilter(filter: PostsFilter): void {
    this.selectedFilter = filter;
    filter === 'bookmarks' ? this.loadBookmarks() : this.loadHomeFeed(filter);
  }
}
