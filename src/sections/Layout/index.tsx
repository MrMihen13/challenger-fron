import { FC, useCallback, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import s from "./styles.module.css";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
import { routes } from "../../config";
import { Loader } from "../../components";

export const Layout: FC = observer(() => {
  const userStore = useStore("userStore");
  const chatStore = useStore("chatStore");
  const navigator = useNavigate();
  const location = useLocation();

  const pollRequests = useCallback(() => {
    const id = setInterval(() => {
      if (!chatStore.dialogId) {
        clearInterval(id);
        return;
      }
      chatStore.getHistory({ dialogId: chatStore.dialogId });
    }, 3000);
    return id;
  }, [chatStore]);

  const intialRequests = useCallback(async () => {
    if (userStore.user.isAuthorized && !userStore.user.userId) {
      try {
        await userStore.authService.verifyToken(userStore.user.authToken);
        await userStore.getInfo(userStore.user.userId);
        if (location.pathname.includes(routes.auth)) {
          navigator(`/${routes.main}`);
        }
      } catch (e) {
        navigator(`/${routes.auth}`);
      }
    }
  }, [userStore, location, navigator]);

  useEffect(() => {
    intialRequests();
    const id = pollRequests();
    return () => {
      clearInterval(id);
    };
  }, [intialRequests, pollRequests]);

  if (userStore.flags.user.isLoading && userStore.user.isAuthorized) {
    return (
      <div className={s.loaderWrapper}>
        <Loader />
      </div>
    );
  }

  return (
    <main className={s.body}>
      <Outlet />
    </main>
  );
});
