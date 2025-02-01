"use client";

import dynamic from 'next/dynamic';
import { ToastOptions } from 'react-hot-toast';

export const DynamicToaster = dynamic(
  () => import('react-hot-toast').then((mod) => mod.Toaster),
  {
    ssr: false,
    loading: () => null,
  }
);

// Create a wrapper for toast functions
const createToast = async () => {
  const toast = (await import('react-hot-toast')).default;
  return {
    success: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    promise: toast.promise,
  };
};

let toastInstance: Awaited<ReturnType<typeof createToast>> | null = null;

export const toast = {
  success: async (msg: string) => {
    if (!toastInstance) toastInstance = await createToast();
    return toastInstance.success(msg);
  },
  error: async (msg: string) => {
    if (!toastInstance) toastInstance = await createToast();
    return toastInstance.error(msg);
  },
  promise: async <T,>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string },
    opts?: ToastOptions
  ) => {
    if (!toastInstance) toastInstance = await createToast();
    return toastInstance.promise(promise, msgs, opts);
  },
};
