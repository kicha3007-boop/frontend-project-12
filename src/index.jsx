import * as Sentry from "@sentry/react";
import ReactDOM from "react-dom/client";
import { io } from "socket.io-client";

import init from "./init.jsx";

// Коллектор ошибок (Bugsink принимает тот же протокол, что Sentry) — вне дерева компонентов.
// DSN задаётся переменной окружения VITE_SENTRY_DSN при сборке.
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN });
}

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector("#chat"));
  const socket = io();
  root.render(await init(socket));
};

app();
