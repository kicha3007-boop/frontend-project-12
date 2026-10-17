import { Box, Button, Group, Menu, ScrollArea, Stack, Text, VisuallyHidden } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { useUi } from "../contexts.js";
import useCurrentChannel from "./currentChannel.js";

const ChannelItem = ({ channel, isActive }) => {
  const { t } = useTranslation();
  const setCurrentChannel = useUi((state) => state.setCurrentChannel);
  const openModal = useUi((state) => state.openModal);
  const variant = isActive ? "filled" : "subtle";

  const channelButton = (
    <Button
      variant={variant}
      justify="start"
      fullWidth
      leftSection="#"
      onClick={() => setCurrentChannel(channel.id)}
      styles={{ label: { overflow: "hidden", textOverflow: "ellipsis" } }}
    >
      {channel.name}
    </Button>
  );

  if (!channel.removable) {
    return channelButton;
  }

  return (
    <Group gap={0} wrap="nowrap">
      <Box flex={1} miw={0}>
        {channelButton}
      </Box>
      <Menu position="bottom-end">
        <Menu.Target>
          <Button variant={variant} px="xs">
            ▾<VisuallyHidden>{t("chat.channelControl")}</VisuallyHidden>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => openModal("removing", channel.id)}>
            {t("chat.remove")}
          </Menu.Item>
          <Menu.Item onClick={() => openModal("renaming", channel.id)}>
            {t("chat.rename")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};

const Channels = ({ channels }) => {
  const { t } = useTranslation();
  const openModal = useUi((state) => state.openModal);
  const currentChannel = useCurrentChannel(channels);

  return (
    <Stack w={260} p="sm" gap="xs" bg="gray.0">
      <Group justify="space-between">
        <Text fw={700}>{t("chat.channels")}</Text>
        <Button variant="outline" size="xs" onClick={() => openModal("adding")}>
          {t("chat.addChannel")}
        </Button>
      </Group>
      <ScrollArea flex={1}>
        <Stack gap={4}>
          {channels.map((channel) => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              isActive={channel.id === currentChannel.id}
            />
          ))}
        </Stack>
      </ScrollArea>
    </Stack>
  );
};

export default Channels;
