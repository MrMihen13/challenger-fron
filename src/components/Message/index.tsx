import clsx from "clsx";
import { FC, useMemo } from "react";
import { Message, UserId } from "../../domains";
import s from "./styles.module.css";

type MsgProps = Message & {
  userId: UserId;
};

export const Msg: FC<MsgProps> = ({ mediaUrl, text, sender, userId }) => {
  const style = useMemo(() => (sender === userId ? "me" : "partner"), [
    sender,
    userId
  ]);
  return (
    <div className={clsx(s.wrapper, s[style])}>
      {mediaUrl && (
        <div className={clsx(s.attachment)}>
          <img src={mediaUrl} alt={mediaUrl} />
        </div>
      )}
      <div className={clsx(s.text)}>{text}</div>
    </div>
  );
};
