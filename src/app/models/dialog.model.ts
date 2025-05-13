export type DialogType = 'confirm' | 'info' | 'success' | 'warning' | 'error';

export interface DialogData {
  type: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export interface DialogResult {
  confirmed: boolean;
}