import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AttachIcon,
  AudioIcon,
  EmojiIcon,
  SendIcon,
  Drawer
} from "../../../../components";
import { useStore } from "../../../../store";
import s from "./styles.module.css";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

const defaultValues = {
  text: "",
  media: null
};

export const ChatInput = observer(() => {
  const chatStore = useStore("chatStore");
  const userStore = useStore("userStore");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [openActions, setOpenActions] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues
  });
  const [fileUrl, setFileUrl] = useState("");
  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      await chatStore.sendMessage({
        //@ts-ignore
        dialogId: chatStore.dialogId,
        text: data.text,
        messageType: fileUrl ? "MEDIA" : "TEXT",
        ...(fileUrl ? { mediaUrl: fileUrl } : {})
      });
      setValue("text", "");
      setValue("media", null);
      setFileUrl("");
    },
    [chatStore, fileUrl, setValue]
  );

  const isAdmin = useMemo(() => userStore.user.userRole === "CLIENT", [
    userStore.user.userRole
  ]);

  const text = watch("text");
  const hasMessage = useMemo(() => text.length || fileUrl, [text, fileUrl]);

  const handleOpenEmodji = useCallback(() => {
    setOpenEmoji((prev) => !prev);
  }, []);

  const handleCloseEmoji = useCallback(() => {
    setOpenEmoji(false);
  }, []);

  const handleOpenActions = useCallback(() => {
    setOpenActions((prev) => !prev);
  }, []);

  const handleCloseActions = useCallback(() => {
    setOpenActions(false);
  }, []);

  const onFilesChange = useCallback(
    (e) => {
      setFileUrl(URL.createObjectURL(e.target.files[0]));
      handleCloseActions();
    },
    [handleCloseActions]
  );

  const handleEmojiClick = useCallback(
    (emoji: EmojiClickData, ev) => {
      setValue("text", text + emoji.emoji);
      ev.stopPropagation();
    },
    [setValue, text]
  );

  return (
    <section className={clsx(s.wrapper)}>
      <div className={clsx(s.attachments)}>
        {fileUrl && (
          <div className={s.attchmentItem}>
            <img src={fileUrl} className={s.attachmentFile} alt="attchment" />
          </div>
        )}
      </div>
      <form className={clsx(s.form)} onSubmit={handleSubmit(onSubmit)}>
        <button
          onClick={handleOpenEmodji}
          type="button"
          className={clsx("icon-button", s.emodjiBtn)}
        >
          <EmojiIcon />
        </button>
        <Drawer handleClose={handleCloseEmoji} open={openEmoji}>
          <p className={s.preview}>Сообщение: {text}</p>
          <EmojiPicker width="100%" onEmojiClick={handleEmojiClick} />
        </Drawer>
        <input
          placeholder="Сообщение"
          className={s.message}
          {...register("text")}
        />
        <div className={s.actions}>
          {hasMessage ? (
            <button
              type="submit"
              className={clsx("icon-button", "button-blue", s.sendButton)}
            >
              <SendIcon />
            </button>
          ) : (
            <div className={clsx(s.attachmentsActions)}>
              <Drawer handleClose={handleCloseActions} open={openActions}>
                <div className={s.defaultActions}>
                  <div className={s.action}>
                    <label
                      className={clsx(s.add, "icon-button")}
                      htmlFor="attach"
                    >
                      <AttachIcon /> <span>Добавить файл</span>
                    </label>
                    <input
                      {...register("media")}
                      id="attach"
                      type="file"
                      onChange={onFilesChange}
                      className={clsx("icon-button", s.addInput)}
                    />
                  </div>
                  <div className={s.action}>
                    <button
                      type="button"
                      className={clsx("icon-button", s.audio)}
                    >
                      <AudioIcon /> <span>Голосовое сообщение</span>
                    </button>
                  </div>
                </div>
                {isAdmin && <div className={s.adminAction}></div>}
              </Drawer>
              <button
                onClick={handleOpenActions}
                type="button"
                className={clsx(s.add, "icon-button")}
              >
                <AttachIcon />
              </button>
            </div>
          )}
        </div>
      </form>
    </section>
  );
});
