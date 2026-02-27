import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { UserProfile } from '../../core/models/user/user-profile.model';
import { PostService } from '../../core/services/post.service';
import { Post } from '../../core/models/posts/post.model';
import { DatePipe, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { ImageOverlay } from '../../shared/components/image-overlay/image-overlay.component';

@Component({
  selector: 'app-profile',
  imports: [NgClass, DatePipe, ImageOverlay],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class Profile implements OnInit {
  private userService: UserService = inject(UserService);
  private router = inject(Router);

  profile!: UserProfile;
  selectedFilter: 'all' | 'saved' = 'all';
  posts: Post[] = [];
  currentPostsCount!: number;
  bookmarkedPostsCount!: number;
  allPostsCount!: number;
  selectedOverlayImageUrl: string = '';

  get filteredPosts() {
    if (this.selectedFilter === 'saved') {
      const savedPosts = this.posts.filter((post) => post.bookmarked);
      this.currentPostsCount = savedPosts.length;
      return savedPosts;
    }
    this.currentPostsCount = this.posts.length;
    return this.posts;
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  setFilter(filter: 'all' | 'saved'): void {
    this.selectedFilter = filter;
  }

  expandImage(imgUrl: string) {
    this.selectedOverlayImageUrl = imgUrl;
  }
  closeImageOverlay(event: Event) {
    if (!(event.target instanceof HTMLImageElement) && (this.selectedOverlayImageUrl = '')) {
      this.selectedOverlayImageUrl = '';
    }
  }

  openPost(id: string): void {
    this.router.navigate(['/post', id]);
  }

  loadProfile() {
    this.userService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.loadPosts();
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      },
    });
  }

  loadPosts() {
    this.userService.getUserPosts(this.profile._id).subscribe({
      next: (posts) => {
        this.posts = posts;
        this.allPostsCount = posts.length;
        this.currentPostsCount = posts.length;
        this.bookmarkedPostsCount = posts.filter((post) => post.bookmarked).length;
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
      },
    });
  }
}
