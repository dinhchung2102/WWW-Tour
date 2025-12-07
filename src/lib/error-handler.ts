import { toast } from "sonner";
import { AxiosError } from "axios";

interface ErrorResponse {
  code?: string;
  error?: string;
  message?: string;
  timestamp?: string;
  status?: number;
}

/**
 * Extract error message from API error response
 * Supports both old format (response.data as string) and new format (response.data.message)
 */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<ErrorResponse | string>;
    const responseData = axiosError.response?.data;

    if (typeof responseData === "string") {
      return responseData;
    }

    if (responseData && typeof responseData === "object") {
      // New format: { message, error, code, ... }
      if (responseData.message) {
        return responseData.message;
      }
      if (responseData.error) {
        return responseData.error;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Đã xảy ra lỗi không xác định";
}

/**
 * Show error toast notification
 */
export function showErrorToast(error: unknown, defaultMessage?: string) {
  const message = getErrorMessage(error) || defaultMessage || "Đã xảy ra lỗi";
  toast.error(message);
}

/**
 * Show success toast notification
 */
export function showSuccessToast(message: string) {
  toast.success(message);
}
