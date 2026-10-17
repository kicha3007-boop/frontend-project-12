import { useUi } from "../contexts.js";

// Текущий канал: выбранный в интерфейсе, а если его нет (не выбран или удалён) — первый, General
const useCurrentChannel = (channels) => {
  const currentChannelId = useUi((state) => state.currentChannelId);
  return channels.find(({ id }) => id === currentChannelId) ?? channels[0];
};

export default useCurrentChannel;
