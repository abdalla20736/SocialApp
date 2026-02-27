import { SuggestedUser } from './suggested-user.model';

export interface SuggestionResponse {
  success: boolean;
  message: string;
  data: {
    suggestions: SuggestedUser[];
  };
  meta: {
    Pagination: Pagination;
  };
}

interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
  nextPage: number;
}
