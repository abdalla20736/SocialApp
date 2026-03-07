export interface DeleteModalData {
  type: 'post' | 'comment' | 'reply';
  title: string;
  message: string;
  id: string;
  deletedItemName: string;
  onDelete: () => void;
}
