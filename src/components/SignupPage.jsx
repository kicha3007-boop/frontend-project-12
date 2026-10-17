import { Button, Card, Center, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { hasLength, isNotEmpty, matchesField, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts.js";
import { appRoutes } from "../routes.js";

const SignupPage = () => {
  const { t } = useTranslation();
  const signUp = useAuth((state) => state.signUp);
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState(false);
  const usernameRef = useRef(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const form = useForm({
    initialValues: { username: "", password: "", confirmPassword: "" },
    validateInputOnBlur: true,
    validate: {
      username: hasLength({ min: 3, max: 20 }, t("validation.length")),
      password: hasLength({ min: 6 }, t("validation.passwordMin")),
      confirmPassword: (value, values) =>
        isNotEmpty(t("validation.required"))(value) ??
        matchesField("password", t("validation.passwordsMatch"))(value, values),
    },
  });

  const handleSubmit = ({ username, password }) => {
    setSubmitting(true);
    signUp({ username: username.trim(), password })
      .then(() => navigate(appRoutes.chat()))
      .catch((error) => {
        if (error.status === 409) {
          form.setErrors({ username: t("signup.userExists") });
          return;
        }
        notifications.show({ color: "red", message: t("notifications.connectionError") });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Center h="100%">
      <Card withBorder shadow="sm" w={400} p="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Title order={2} ta="center">
              {t("signup.title")}
            </Title>
            <TextInput
              label={t("signup.username")}
              autoComplete="username"
              ref={usernameRef}
              {...form.getInputProps("username")}
            />
            <PasswordInput
              label={t("signup.password")}
              autoComplete="new-password"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label={t("signup.confirmPassword")}
              autoComplete="new-password"
              {...form.getInputProps("confirmPassword")}
            />
            <Button type="submit" loading={isSubmitting}>
              {t("signup.submit")}
            </Button>
          </Stack>
        </form>
      </Card>
    </Center>
  );
};

export default SignupPage;
