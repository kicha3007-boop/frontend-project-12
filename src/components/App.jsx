import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

// Стили Mantine подключаются рядом с провайдером темы: в браузерном режиме тесты монтируют
// приложение из init, импорты из index.jsx до страницы не доезжают.
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { useAuth } from "../contexts.js";
import { appRoutes } from "../routes.js";
import ChatPage from "./ChatPage.jsx";
import Layout from "./Layout.jsx";
import LoginPage from "./LoginPage.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import SignupPage from "./SignupPage.jsx";

const PrivateRoute = ({ children }) => {
  const token = useAuth((state) => state.token);
  const location = useLocation();
  return token ? children : <Navigate to={appRoutes.login()} state={{ from: location }} />;
};

const App = () => (
  <MantineProvider>
    <Notifications position="bottom-right" />
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path={appRoutes.chat()}
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route path={appRoutes.login()} element={<LoginPage />} />
          <Route path={appRoutes.signup()} element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </MantineProvider>
);

export default App;
