import { SuggestedUser } from './suggested-user.model';

export interface SearchSuggestionResponse {
  success: boolean;
  message: string;
  data: {
    users: SuggestedUser[];
  };
  meta: Meta;
}

export interface Meta {
  pagination: {
    currentPage: number;
    limit: number;
    total: number;
    numberOfPages: number;
    nextPage: number;
  };
}
