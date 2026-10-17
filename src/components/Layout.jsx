import { Anchor, AppShell, Button, Group } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router-dom";

import { useAuth } from "../contexts.js";
import { appRoutes } from "../routes.js";

const Layout = () => {
  const { t } = useTranslation();
  const token = useAuth((state) => state.token);
  const logOut = useAuth((state) => state.logOut);

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Anchor component={Link} to={appRoutes.chat()} fw={700} c="dark">
            {t("header.brand")}
          </Anchor>
          {token && <Button onClick={logOut}>{t("header.logOut")}</Button>}
        </Group>
      </AppShell.Header>
      <AppShell.Main h="100dvh">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
