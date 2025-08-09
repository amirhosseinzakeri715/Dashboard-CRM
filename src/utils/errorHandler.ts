import { AxiosError } from "axios"
import { toast } from "react-toastify"

export const errorHandler = (error: AxiosError, addNotification?: (notif: { type: string, message: string }) => void) => {
  const appError = (error.response?.data as { error: string })?.error;
  const message = typeof appError === "string" ? appError : error.message;
  toast.error(message);
  if (addNotification) {
    addNotification({ type: 'error', message });
  }
};

export function extractApiErrorMessage(error: any): string {
  if (error?.response?.data) {
    if (typeof error.response.data === 'string') return error.response.data;
    if (typeof error.response.data.detail === 'string') return error.response.data.detail;
    if (typeof error.response.data.error === 'string') return error.response.data.error;
    const firstField = Object.keys(error.response.data)[0];
    if (firstField) {
      const val = error.response.data[firstField];
      if (Array.isArray(val)) return `${firstField}: ${val[0]}`;
      if (typeof val === 'string') return `${firstField}: ${val}`;
    }
    return JSON.stringify(error.response.data);
  }
  if (error?.message) return error.message;
  return 'An unknown error occurred';
}