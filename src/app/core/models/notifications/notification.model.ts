import { NotificationPost } from './notification-post.model';
import { NotificationUser } from './notification-user.model';

export interface Notification {
  _id: string;
  recipient: Recipient;
  actor: Actor;
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  entity: NotificationPost | NotificationUser;
}

export interface Recipient {
  _id: string;
  name: string;
  photo: string;
}

export interface Actor {
  _id: string;
  name: string;
  photo: string;
}
