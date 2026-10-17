import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

import request from "./http.js";
import { apiRoutes } from "../routes.js";

// API авторизации: токен и имя пользователя живут в хранилище, между перезагрузками —
// в localStorage через persist. Компоненты работают только с этими функциями.
const createAuthStore = () =>
  createStore(
    persist(
      (set) => ({
        token: null,
        username: null,
        logIn: (credentials) =>
          request(apiRoutes.login(), { method: "POST", body: credentials }).then(
            ({ token, username }) => set({ token, username }),
          ),
        signUp: (credentials) =>
          request(apiRoutes.signup(), { method: "POST", body: credentials }).then(
            ({ token, username }) => set({ token, username }),
          ),
        logOut: () => set({ token: null, username: null }),
      }),
      {
        name: "hexlet-chat-auth",
        partialize: ({ token, username }) => ({ token, username }),
      },
    ),
  );

export default createAuthStore;
