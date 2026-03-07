import { SuggestedUser } from '../../../../../core/models/user/suggested-user.model';
import { Component, inject, Input, OnInit } from '@angular/core';
import { UserService } from '../../../../../core/services/user.service';
import { SuggestionSkeleton } from '../components/suggestion-skeleton/suggestion-skeleton.component';
import {
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SuggestionCard } from '../components/suggestion-card/suggestion-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suggestion-form',
  imports: [SuggestionCard, FormsModule, SuggestionSkeleton, RouterLink, CommonModule],
  templateUrl: './suggestion-form.component.html',
  styleUrl: './suggestion-form.component.css',
})
export class SuggestionForm {
  private readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);
  private _filteredSuggestedUsers: SuggestedUser[] = [];

  @Input() isSideBar: boolean = false;

  isLoading: boolean = true;
  isLoadingMore: boolean = false;
  searchTerm: string = '';
  search$: Subject<string> = new Subject<string>();
  searchSub?: Subscription;
  loadingUserId: string | null = null;
  limit: number = this.isSideBar ? 5 : 20;
  page: number = 1;

  get filteredSuggestedUsers(): SuggestedUser[] {
    return this.isSideBar ? this._filteredSuggestedUsers.slice(0, 5) : this._filteredSuggestedUsers;
  }

  set filteredSuggestedUsers(value: SuggestedUser[]) {
    this._filteredSuggestedUsers = value;
  }

  get suggestionCount(): number {
    return this.filteredSuggestedUsers.length;
  }

  get viewMoreButtonText(): string {
    return this.isSideBar
      ? 'View more'
      : this.isLoadingMore
        ? ' Loading more...'
        : 'Load more users';
  }

  navigateSuggestion() {
    if (!this.isSideBar) {
      return;
    }
    this.router.navigate(['/suggestions']);
  }

  onSearchInput(): void {
    this.search$.next(this.searchTerm);
 
  }

  ngOnInit(): void {
    this.InitSearch();
    this.loadSuggestedUsers();
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  InitSearch(): void {
    this.searchSub = this.search$
      .pipe(
        tap(() => (this.isLoading = true)),
        debounceTime(800),
        distinctUntilChanged(),
        switchMap((term) => {

          if (!term.trim()) {
            this.loadSuggestedUsers();
            return EMPTY;
          }
          return this.userService.getSuggestedUsersBySearchTerm(term, 5);
        }),
      )
      .subscribe({
        next: (suggestedUsers) => {
          this.isLoading = false;
          this.filteredSuggestedUsers = suggestedUsers;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Failed to load suggested users:', err);
        },
      });
  }

  followUser(id: string) {
    this.loadingUserId = id;

    this.userService.followUser(id).subscribe({
      next: () => {
        this.loadingUserId = null;

        if (!this.isSideBar) {
          this.loadSuggestedUsers();
          this._filteredSuggestedUsers = this._filteredSuggestedUsers.filter(
            (user) => user._id !== id,
          );
        } else {
          const user = this._filteredSuggestedUsers.find((user) => user._id === id);
          if (user) {
            user.followed = !user.followed;
          }
        }
      },
      error: (err) => {
        console.error('Failed to follow user:', err);
        this.loadingUserId = null;
      },
    });
  }

  loadMoreUsers() {
    if (this.isSideBar) {
      return;
    }
    this.isLoadingMore = true;
    this.page++;
    this.userService.getSuggestedUsers(this.page, this.limit).subscribe({
      next: (suggestedUsers) => {
        this.filteredSuggestedUsers = [...this.filteredSuggestedUsers, ...suggestedUsers];
        this.isLoadingMore = false;
      },
      error: (err) => {
        console.error('Failed to load more suggested users:', err);
        this.isLoadingMore = false;
      },
    });
  }

  loadSuggestedUsers(): void {
    const firstPage = 1;
    this.userService.getSuggestedUsers(firstPage, this.limit).subscribe({
      next: (suggestedUsers) => {
        this.filteredSuggestedUsers = suggestedUsers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load suggested users:', err);
        this.isLoading = false;
      },
    });
  }
}
