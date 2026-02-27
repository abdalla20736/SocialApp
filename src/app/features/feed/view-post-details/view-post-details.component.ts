import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PostCard } from '../components/post-card/post-card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../../../core/models/posts/post.model';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-view-post-details',
  imports: [PostCard, RouterLink],
  templateUrl: './view-post-details.component.html',
  styleUrl: './view-post-details.component.css',
})
export class ViewPostDetails implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private postService: PostService = inject(PostService);
  private location: Location = inject(Location);

  post!: Post;
  isLoading: boolean = true;

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    this.loadPost(postId!);
  }

  navigateBack(): void {
    this.location.back();
  }

  loadPost(postId: string) {
    this.postService.getSinglePost(postId).subscribe({
      next: (post) => {
        this.post = post;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load post details:', err);
        this.isLoading = false;
      },
    });
  }
}
