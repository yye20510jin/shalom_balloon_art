import { toast } from "react-toastify";

const baseOptions = {
  position: "top-center",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export function showToast(message, options = {}) {
  toast(message, {
    ...baseOptions,
    ...options,
  });
}

export function showSuccess(message, options = {}) {
  toast.success(message, {
    ...baseOptions,
    ...options,
  });
}

export function showError(message, options = {}) {
  toast.error(message, {
    ...baseOptions,
    ...options,
  });
}

export function showWarning(message, options = {}) {
  toast.warning(message, {
    ...baseOptions,
    ...options,
  });
}

export function showInfo(message, options = {}) {
  toast.info(message, {
    ...baseOptions,
    ...options,
  });
}