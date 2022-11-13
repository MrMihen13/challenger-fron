import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { FC, useCallback, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Loader, ProfileIcon } from "../../components";
import { routes } from "../../config";
import { useStore } from "../../store";
import { ChatInput, Messages } from "./sections";
import s from "./styles.module.css";

export const ChatPage: FC = observer(() => {
  const chatStore = useStore("chatStore");

  const getDialog = useCallback(async () => {
    if (!chatStore.dialogId) {
      await chatStore.getDialogs();
    }
  }, [chatStore, chatStore.dialogId]);

  const getHistory = useCallback(async () => {
    if (chatStore.dialogId) {
      await chatStore.getHistory({ dialogId: chatStore.dialogId });
    }
  }, [chatStore, chatStore.dialogId]);

  useEffect(() => {
    getDialog();
  }, [getDialog]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  if (
    chatStore.flags.dialog.isLoading ||
    (chatStore.flags.history.isLoading && chatStore.messages.length === 0)
  ) {
    return (
      <div className={clsx("full-loader")}>
        <Loader />
      </div>
    );
  }

  return (
    <section className={clsx("container", s.wrapper)}>
      <div className={clsx(s.header)}>
        <NavLink
          className={clsx("icon-button", s.profile)}
          to={`/${routes.profile}`}
        >
          <ProfileIcon />
        </NavLink>
      </div>
      <Messages />
      <ChatInput />
    </section>
  );
});
