import { createContext, useContext } from "react";

export const ToastContext = createContext({ notify: () => {} });

// notify(message, type?) where type is "success" | "error" | "info"
export const useToast = () => useContext(ToastContext);
