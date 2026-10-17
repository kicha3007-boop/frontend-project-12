import { createStore } from "zustand/vanilla";

// Состояние интерфейса: текущий канал (null — канал по умолчанию) и открытая модалка
// { type: 'adding' | 'renaming' | 'removing', channelId }.
const createUiStore = () =>
  createStore((set) => ({
    currentChannelId: null,
    modal: null,
    setCurrentChannel: (currentChannelId) => set({ currentChannelId }),
    openModal: (type, channelId = null) => set({ modal: { type, channelId } }),
    closeModal: () => set({ modal: null }),
  }));

export default createUiStore;
