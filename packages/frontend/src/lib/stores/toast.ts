import { toast } from 'svelte-sonner';

export type ToastType = 'success' | 'error' | 'info' | 'warning';


export const toastStore = {
  success: (message: string, duration?: number) => {
    toast.success(message, { duration });
  },
  error: (message: string, duration?: number) => {
    toast.error(message, { duration });
  },
  info: (message: string, duration?: number) => {
    toast.info(message, { duration });
  },
  warning: (message: string, duration?: number) => {
    toast.warning(message, { duration });
  },
  dismiss: (id: string | number) => {
    toast.dismiss(id);
  },
  clear: () => {
    toast.dismiss();
  },
};
