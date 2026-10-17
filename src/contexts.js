import { createContext, useContext } from "react";
import { useStore } from "zustand";

export const AuthContext = createContext(null);
export const UiStoreContext = createContext(null);
export const ChatApiContext = createContext(null);

export const useAuth = (selector) => useStore(useContext(AuthContext), selector);
export const useUi = (selector) => useStore(useContext(UiStoreContext), selector);
export const useChatApi = () => useContext(ChatApiContext);
