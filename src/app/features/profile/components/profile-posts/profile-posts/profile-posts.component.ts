import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Post } from '../../../../../core/models/posts/post.model';
import { PostCard } from '../../../../../shared/components/post-card/post-card/post-card.component';
import { UserService } from '../../../../../core/services/user.service';
import { ProfilePostCard } from '../components/profile-post-card/profile-post-card.component';
import { ProfilePostFilter } from '../components/profile-post-filter/profile-post-filter.component';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-profile-posts',
  imports: [PostCard, ProfilePostCard, ProfilePostFilter],
  templateUrl: './profile-posts.component.html',
  styleUrl: './profile-posts.component.css',
})
export class ProfilePosts implements OnChanges {
  private readonly authService: AuthService = inject(AuthService);
  private readonly userService: UserService = inject(UserService);

  @Input() isProfileOwner: boolean = false;
  @Input() userId!: string;

  @Output() postLoaded = new EventEmitter<[number, number]>();

  posts!: Post[];
  bookmarkedPosts!: Post[];
  currentPostsCount!: number;
  bookmarkedPostsCount!: number;
  allPostsCount!: number;
  isLoading: boolean = true;
  currentUser = this.authService.getCurrentUser();
  filteredPosts!: Post[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.onLoadPosts();
    }
  }

  onPostLoaded(): void {
    this.postLoaded.emit([this.allPostsCount, this.bookmarkedPostsCount]);
  }

  onLoadPosts(): void {
    this.isLoading = true;

    this.userService
      .getUserPosts(this.userId)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (posts) => {
          this.posts = posts.slice(0, 20);
          this.filteredPosts = this.posts;
          this.allPostsCount = this.posts.length;
          this.currentPostsCount = this.posts.length;
          this.onPostLoaded();
        },
        error: (err) => {
          console.error('Failed to load posts:', err);
        },
      });

    this.userService.getBookMarksPosts(1, 20).subscribe({
      next: (bookmarkedPosts) => {
        this.bookmarkedPosts = bookmarkedPosts;
        this.bookmarkedPostsCount = bookmarkedPosts.length;
        this.onPostLoaded();
      },
      error: (err) => {
        console.error('Failed to load bookmarked posts:', err);
      },
    });
  }

  filterPosts(filter: 'all' | 'bookmarks'): void {
    this.isLoading = true;
    switch (filter) {
      case 'all':
        this.filteredPosts = this.posts.slice(0, 20);
        this.currentPostsCount = this.filteredPosts.length;
        this.onPostLoaded();

        break;
      case 'bookmarks':
        if (!this.isProfileOwner) {
          return;
        }
        this.filteredPosts = this.bookmarkedPosts;
        this.currentPostsCount = this.filteredPosts.length;
        break;
    }
  }
}
