import { Anchor, Center, Stack, Text, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { appRoutes } from "../routes.js";

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <Center h="100%">
      <Stack align="center">
        <Title order={1}>{t("notFound.title")}</Title>
        <Text>
          <Anchor component={Link} to={appRoutes.chat()}>
            {t("notFound.goHome")}
          </Anchor>
        </Text>
      </Stack>
    </Center>
  );
};

export default NotFoundPage;
