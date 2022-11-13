import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../Layout";
import { routes } from "../../config";
import { AuthPage, ChatPage, ProfilePage } from "../../pages";

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<Layout />}>
            <Route path={routes.auth} element={<AuthPage />} />
            <Route path={routes.main} element={<ChatPage />} />
            <Route path={routes.profile} element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
