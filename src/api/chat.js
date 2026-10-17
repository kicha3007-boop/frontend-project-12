import request from "./http.js";
import { apiRoutes } from "../routes.js";

export const queryKeys = {
  channels: ["channels"],
  messages: ["messages"],
};

// Обёртка над сервером чата: компоненты отправляют сообщения и правят каналы только через неё.
// Изменения возвращаются в кеш событиями сокета (см. subscribeToSocket).
const createChatApi = (authStore) => {
  const withToken = (options = {}) => ({ ...options, token: authStore.getState().token });

  return {
    fetchChannels: () => request(apiRoutes.channels(), withToken()),
    fetchMessages: () => request(apiRoutes.messages(), withToken()),
    sendMessage: (message) =>
      request(apiRoutes.messages(), withToken({ method: "POST", body: message })),
    addChannel: (channel) =>
      request(apiRoutes.channels(), withToken({ method: "POST", body: channel })),
    renameChannel: (id, name) =>
      request(apiRoutes.channel(id), withToken({ method: "PATCH", body: { name } })),
    removeChannel: (id) => request(apiRoutes.channel(id), withToken({ method: "DELETE" })),
  };
};

export const subscribeToSocket = (socket, queryClient, uiStore) => {
  socket.on("newMessage", (message) => {
    queryClient.setQueryData(queryKeys.messages, (messages = []) => [...messages, message]);
  });
  socket.on("newChannel", (channel) => {
    queryClient.setQueryData(queryKeys.channels, (channels = []) =>
      channels.some(({ id }) => id === channel.id) ? channels : [...channels, channel],
    );
  });
  socket.on("renameChannel", (channel) => {
    queryClient.setQueryData(queryKeys.channels, (channels = []) =>
      channels.map((item) => (item.id === channel.id ? channel : item)),
    );
  });
  socket.on("removeChannel", ({ id }) => {
    queryClient.setQueryData(queryKeys.channels, (channels = []) =>
      channels.filter((channel) => channel.id !== id),
    );
    queryClient.setQueryData(queryKeys.messages, (messages = []) =>
      messages.filter((message) => message.channelId !== id),
    );
    if (uiStore.getState().currentChannelId === id) {
      uiStore.getState().setCurrentChannel(null);
    }
  });
};

export default createChatApi;
