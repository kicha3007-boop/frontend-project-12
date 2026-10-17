import { Box, Button, Group, ScrollArea, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import leoProfanity from "leo-profanity";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth, useChatApi } from "../contexts.js";
import useCurrentChannel from "./currentChannel.js";

const MessageForm = ({ channelId }) => {
  const { t } = useTranslation();
  const chatApi = useChatApi();
  const username = useAuth((state) => state.username);
  const inputRef = useRef(null);
  const [isSending, setSending] = useState(false);
  const form = useForm({ initialValues: { body: "" } });

  useEffect(() => {
    inputRef.current?.focus();
  }, [channelId, isSending]);

  const handleSubmit = ({ body }) => {
    const text = body.trim();
    if (!text) {
      return;
    }
    setSending(true);
    chatApi
      .sendMessage({ body: leoProfanity.clean(text), channelId, username })
      .then(() => form.reset())
      .catch(() =>
        notifications.show({ color: "red", message: t("notifications.connectionError") }),
      )
      .finally(() => setSending(false));
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group gap="xs" wrap="nowrap">
        <TextInput
          ref={inputRef}
          aria-label={t("chat.newMessage")}
          placeholder={t("chat.messagePlaceholder")}
          autoComplete="off"
          disabled={isSending}
          flex={1}
          {...form.getInputProps("body")}
        />
        <Button type="submit" disabled={isSending || !form.values.body.trim()}>
          {t("chat.send")}
        </Button>
      </Group>
    </form>
  );
};

const Messages = ({ channels, messages }) => {
  const { t } = useTranslation();
  const currentChannel = useCurrentChannel(channels);
  const viewportRef = useRef(null);
  const channelMessages = messages.filter(({ channelId }) => channelId === currentChannel.id);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight });
  }, [currentChannel.id, channelMessages.length]);

  return (
    <Stack flex={1} miw={0} gap={0}>
      <Box p="sm" bg="gray.0">
        <Text fw={700} truncate>{`# ${currentChannel.name}`}</Text>
        <Text size="sm" c="dimmed">
          {t("chat.messages", { count: channelMessages.length })}
        </Text>
      </Box>
      <ScrollArea viewportRef={viewportRef} flex={1} p="sm">
        <Stack gap={4}>
          {channelMessages.map((message) => (
            <Text key={message.id} style={{ overflowWrap: "anywhere" }}>
              <b>{message.username}</b>: {message.body}
            </Text>
          ))}
        </Stack>
      </ScrollArea>
      <Box p="sm">
        <MessageForm channelId={currentChannel.id} />
      </Box>
    </Stack>
  );
};

export default Messages;
