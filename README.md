# Hexlet Chat

[![hexlet-check](https://github.com/kicha3007-boop/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/kicha3007-boop/frontend-project-12/actions)
[![CI](https://github.com/kicha3007-boop/frontend-project-12/actions/workflows/main.yml/badge.svg)](https://github.com/kicha3007-boop/frontend-project-12/actions/workflows/main.yml)

Упрощённый аналог Slack: вход и регистрация, каналы (создание, переименование, удаление),
сообщения в реальном времени через веб-сокеты, фильтр нецензурных слов, уведомления.

Учебный проект Хекслета: https://ru.hexlet.io/programs/frontend

## Стек

React, Mantine (компоненты, формы, уведомления), React Router, TanStack Query (серверные данные:
каналы и сообщения), Zustand (состояние интерфейса и авторизация), Socket.IO, i18next,
leo-profanity, Sentry SDK (коллектор ошибок, DSN — переменная `VITE_SENTRY_DSN`).
Бэкенд — [@hexlet/chat-server](https://www.npmjs.com/package/@hexlet/chat-server).

Запуск разделён на два файла: `src/init.jsx` создаёт i18n, клиент запросов, хранилища и подписки
на сокет и возвращает разметку, `src/index.jsx` открывает сокет и монтирует её.

## Требования

- Node.js 22 или новее
- npm, make

## Установка и запуск

```bash
git clone https://github.com/kicha3007-boop/frontend-project-12.git
cd frontend-project-12
make install
make build
make start      # сервер на http://localhost:5001 раздаёт собранный фронтенд
```

Разработка: `make develop` (бэкенд и dev-сервер Vite с прокси на бэкенд), `make test`, `make lint`.
Пользователь для входа: `admin` / `admin`.
