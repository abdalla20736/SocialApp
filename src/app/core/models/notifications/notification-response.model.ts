import { Notification } from './notification.model';
export interface NotificationResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
  };
  meta: Meta;
}

export interface Meta {
  feedMode: string;
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
}
