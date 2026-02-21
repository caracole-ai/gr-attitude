import { NotificationType, ReferenceType } from '../constants/enums';

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  referenceType?: ReferenceType;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}
