import { Center, Flex, Loader } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { queryKeys } from "../api/chat.js";
import { useAuth, useChatApi } from "../contexts.js";
import { appRoutes } from "../routes.js";
import Channels from "./Channels.jsx";
import ChannelModal from "./modals/ChannelModal.jsx";
import Messages from "./Messages.jsx";

const ChatPage = () => {
  const { t } = useTranslation();
  const chatApi = useChatApi();
  const logOut = useAuth((state) => state.logOut);
  const navigate = useNavigate();

  const channelsQuery = useQuery({ queryKey: queryKeys.channels, queryFn: chatApi.fetchChannels });
  const messagesQuery = useQuery({ queryKey: queryKeys.messages, queryFn: chatApi.fetchMessages });
  const error = channelsQuery.error ?? messagesQuery.error;

  useEffect(() => {
    if (!error) {
      return;
    }
    if (error.status === 401) {
      logOut();
      navigate(appRoutes.login());
      return;
    }
    notifications.show({ color: "red", message: t("notifications.connectionError") });
  }, [error, logOut, navigate, t]);

  if (!channelsQuery.data || !messagesQuery.data) {
    return (
      <Center h="100%">
        <Loader aria-label={t("chat.loading")} />
      </Center>
    );
  }

  return (
    <Flex h="calc(100dvh - 60px)">
      <Channels channels={channelsQuery.data} />
      <Messages channels={channelsQuery.data} messages={messagesQuery.data} />
      <ChannelModal channels={channelsQuery.data} />
    </Flex>
  );
};

export default ChatPage;
