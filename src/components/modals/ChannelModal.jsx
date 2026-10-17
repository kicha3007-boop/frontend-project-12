import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import leoProfanity from "leo-profanity";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useChatApi, useUi } from "../../contexts.js";

const notifyConnectionError = (t) =>
  notifications.show({ color: "red", message: t("notifications.connectionError") });

const ChannelNameForm = ({ channels, initialName, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [isSubmitting, setSubmitting] = useState(false);
  const names = channels.map(({ name }) => name).filter((name) => name !== initialName);

  const form = useForm({
    initialValues: { name: initialName },
    validate: {
      name: (value) => {
        const name = value.trim();
        if (name.length < 3 || name.length > 20) {
          return t("validation.length");
        }
        return names.includes(name) ? t("validation.unique") : null;
      },
    },
  });

  const handleSubmit = ({ name }) => {
    setSubmitting(true);
    onSubmit(leoProfanity.clean(name.trim())).finally(() => setSubmitting(false));
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label={t("modals.channelName")}
          data-autofocus
          autoComplete="off"
          {...form.getInputProps("name")}
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel}>
            {t("modals.cancel")}
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {t("modals.submit")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

const AddChannel = ({ channels, onClose }) => {
  const { t } = useTranslation();
  const chatApi = useChatApi();
  const setCurrentChannel = useUi((state) => state.setCurrentChannel);

  const addChannel = (name) =>
    chatApi
      .addChannel({ name })
      .then((channel) => {
        setCurrentChannel(channel.id);
        notifications.show({ color: "green", message: t("notifications.channelAdded") });
        onClose();
      })
      .catch(() => notifyConnectionError(t));

  return (
    <ChannelNameForm channels={channels} initialName="" onSubmit={addChannel} onCancel={onClose} />
  );
};

const RenameChannel = ({ channels, channelId, onClose }) => {
  const { t } = useTranslation();
  const chatApi = useChatApi();
  const channel = channels.find(({ id }) => id === channelId);

  const renameChannel = (name) =>
    chatApi
      .renameChannel(channelId, name)
      .then(() => {
        notifications.show({ color: "green", message: t("notifications.channelRenamed") });
        onClose();
      })
      .catch(() => notifyConnectionError(t));

  return (
    <ChannelNameForm
      channels={channels}
      initialName={channel?.name ?? ""}
      onSubmit={renameChannel}
      onCancel={onClose}
    />
  );
};

const RemoveChannel = ({ channelId, onClose }) => {
  const { t } = useTranslation();
  const chatApi = useChatApi();
  const [isSubmitting, setSubmitting] = useState(false);

  const removeChannel = () => {
    setSubmitting(true);
    chatApi
      .removeChannel(channelId)
      .then(() => {
        notifications.show({ color: "green", message: t("notifications.channelRemoved") });
        onClose();
      })
      .catch(() => notifyConnectionError(t))
      .finally(() => setSubmitting(false));
  };

  return (
    <Stack>
      <Text>{t("modals.confirmRemove")}</Text>
      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>
          {t("modals.cancel")}
        </Button>
        <Button color="red" onClick={removeChannel} loading={isSubmitting} data-autofocus>
          {t("modals.remove")}
        </Button>
      </Group>
    </Stack>
  );
};

const modals = {
  adding: { title: "modals.addTitle", Content: AddChannel },
  renaming: { title: "modals.renameTitle", Content: RenameChannel },
  removing: { title: "modals.removeTitle", Content: RemoveChannel },
};

// Одна модалка в корне чата: тип окна из хранилища интерфейса выбирает содержимое
const ChannelModal = ({ channels }) => {
  const { t } = useTranslation();
  const modal = useUi((state) => state.modal);
  const closeModal = useUi((state) => state.closeModal);
  const current = modal && modals[modal.type];

  return (
    <Modal
      opened={Boolean(current)}
      onClose={closeModal}
      title={current && t(current.title)}
      centered
    >
      {current && (
        <current.Content channels={channels} channelId={modal.channelId} onClose={closeModal} />
      )}
    </Modal>
  );
};

export default ChannelModal;
