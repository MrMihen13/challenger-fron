import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { ChatIcon, EditIcon, SaveIcon } from "../../components";
import { routes } from "../../config";
import { useStore } from "../../store";
import s from "./styles.module.css";

export const ProfilePage = observer(() => {
  const userStore = useStore("userStore");
  const [edit, setEdit] = useState(false);
  const [avatarUrl, setAvatartUrl] = useState("");

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: userStore.user.name,
      surname: userStore.user.surname,
      middleName: userStore.user.middleName,
      avatar: userStore.user.avatar
    }
  });

  const onSubmit = useCallback(
    async (data) => {
      try {
        await userStore.userService.updateUserInfo({
          ...data,
          ...(avatarUrl && { avatar: avatarUrl })
        });
        await userStore.getInfo(userStore.user.userId);
      } catch (e) {
        toast.error(JSON.stringify(e));
      }
    },
    [userStore, avatarUrl]
  );

  const onFilesChange = useCallback((e) => {
    setAvatartUrl(URL.createObjectURL(e.target.files[0]));
  }, []);

  const toggleEdit = useCallback(() => {
    if (edit) {
      handleSubmit(onSubmit)();
    }
    setEdit(!edit);
  }, [edit, handleSubmit, onSubmit]);

  return (
    <section className={clsx(s.wrapper, "container")}>
      <div className={s.header}>
        <NavLink className={clsx("icon-button", s.chat)} to={`/${routes.main}`}>
          <ChatIcon />
        </NavLink>
        <h2 className={s.title}>Профиль</h2>
        <button
          className={clsx("icon-button", s.edit)}
          onClick={toggleEdit}
          type="button"
        >
          {edit ? <SaveIcon /> : <EditIcon />}
        </button>
      </div>
      {!edit ? (
        <div className={s.content}>
          {userStore.user.avatar ? (
            <img
              className={s.avatar}
              src={userStore.user.avatar}
              alt="avatar"
            />
          ) : (
            <div className={clsx(s.avatarMock, s.avatar)} />
          )}
          <h3 className={s.name}>{userStore.fullName}</h3>
        </div>
      ) : (
        <form className={s.content} onSubmit={handleSubmit(onSubmit)}>
          <label className={s.fileLabel} htmlFor="avatar">
            {avatarUrl ? (
              <img className={s.avatar} src={avatarUrl} alt="avatar" />
            ) : (
              <div className={clsx(s.avatarMock, s.avatar)} />
            )}
          </label>
          <input
            className={clsx(s.file)}
            id="avatar"
            type="file"
            onChange={onFilesChange}
          />
          <input className={clsx(s.input)} {...register("name")} />
          <input className={clsx(s.input)} {...register("surname")} />
          <input className={clsx(s.input)} {...register("middleName")} />
        </form>
      )}
    </section>
  );
});
