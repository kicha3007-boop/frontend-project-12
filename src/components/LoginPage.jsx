import {
  Anchor,
  Button,
  Card,
  Center,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts.js";
import { appRoutes } from "../routes.js";

const LoginPage = () => {
  const { t } = useTranslation();
  const logIn = useAuth((state) => state.logIn);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setSubmitting] = useState(false);
  const usernameRef = useRef(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const form = useForm({
    initialValues: { username: "", password: "" },
    validate: {
      username: (value) => (value.trim() ? null : t("validation.required")),
      password: (value) => (value ? null : t("validation.required")),
    },
  });

  const handleSubmit = (values) => {
    setSubmitting(true);
    logIn(values)
      .then(() => navigate(location.state?.from?.pathname ?? appRoutes.chat()))
      .catch((error) => {
        if (error.status === 401) {
          form.setErrors({ username: true, password: t("login.invalidCredentials") });
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
              {t("login.title")}
            </Title>
            <TextInput
              label={t("login.username")}
              autoComplete="username"
              ref={usernameRef}
              {...form.getInputProps("username")}
            />
            <PasswordInput
              label={t("login.password")}
              autoComplete="current-password"
              {...form.getInputProps("password")}
            />
            <Button type="submit" loading={isSubmitting}>
              {t("login.submit")}
            </Button>
            <Text ta="center" size="sm">
              {t("login.noAccount")}{" "}
              <Anchor component={Link} to={appRoutes.signup()}>
                {t("login.signup")}
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Card>
    </Center>
  );
};

export default LoginPage;
