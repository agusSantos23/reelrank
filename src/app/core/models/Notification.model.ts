export interface NotificationData {
  id: string;
  index: number;
  isError: boolean;
  type: 'text' | 'timeline' | 'confirmation';
  text: string;
  position: 'tl' | 'tr' | 'bl' | 'br';
  duration?: number; 
  onConfirm?: () => void; 
  onCancel?: () => void; 
}