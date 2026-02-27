import { Component, inject } from '@angular/core';
import { SuggestionForm } from '../components/suggestion-form/suggestion-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestion',
  imports: [SuggestionForm],
  templateUrl: './suggestion.component.html',
  styleUrl: './suggestion.component.css',
})
export class Suggestions {
  private readonly router = inject(Router);
  isLoading: boolean = true;
  loadingUserId: string | null = null;

  navigateToFeedPage() {
    this.router.navigate(['/feed']);
  }
}
