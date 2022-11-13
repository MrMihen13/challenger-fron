import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Msg } from "../../../../components";
import { useStore } from "../../../../store";
import s from "./styles.module.css";

export const Messages = observer(() => {
  const chatStore = useStore("chatStore");
  const userStore = useStore("userStore");
  const anchor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (anchor.current) {
      anchor.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatStore.messages.length]);
  return (
    <section className={clsx(s.wrapper)}>
      {chatStore.messages.map((message) => (
        <Msg
          key={message.messageId}
          userId={userStore.user.userId}
          {...message}
        />
      ))}
      <div ref={anchor} />
    </section>
  );
});
