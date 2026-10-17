import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18next from "i18next";
import leoProfanity from "leo-profanity";
import { I18nextProvider, initReactI18next } from "react-i18next";

import createAuthStore from "./api/auth.js";
import createChatApi, { subscribeToSocket } from "./api/chat.js";
import App from "./components/App.jsx";
import { AuthContext, ChatApiContext, UiStoreContext } from "./contexts.js";
import resources from "./locales/index.js";
import createUiStore from "./uiStore.js";

// Сокет приходит параметром, открывает его точка входа. Хранилища, клиент запросов и
// экземпляр i18n создаются на каждый запуск: между запусками ничего не переживает.
const init = async (socket) => {
  const i18n = i18next.createInstance();
  await i18n.use(initReactI18next).init({ resources, lng: "ru", fallbackLng: "ru" });

  leoProfanity.loadDictionary("ru");
  leoProfanity.add(leoProfanity.getDictionary("en"));

  const authStore = createAuthStore();
  const uiStore = createUiStore();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  });
  const chatApi = createChatApi(authStore);

  subscribeToSocket(socket, queryClient, uiStore);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authStore}>
          <UiStoreContext.Provider value={uiStore}>
            <ChatApiContext.Provider value={chatApi}>
              <App />
            </ChatApiContext.Provider>
          </UiStoreContext.Provider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default init;
