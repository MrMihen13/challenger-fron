import { FC, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import s from "./styles.module.css";
import clsx from "clsx";
import { useStore } from "../../../store";
import { routes } from "../../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { EyeIcon } from "../../../components";

const defaultValues = {
  login: "",
  password: ""
};

export const AuthForm: FC = observer(() => {
  const navigator = useNavigate();
  const userStore = useStore("userStore");
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues
  });

  const togglePassword = useCallback(() => {
    setShowPass((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (data: typeof defaultValues) => {
      try {
        await userStore.login(data);
        toast.success(`Вы вошли в систему как ${data.login}`);
        navigator(`/${routes.main}`);
      } catch (err) {
        toast.error(JSON.stringify(err, null, 2) || "Ошибка");
      }
    },
    [navigator, userStore]
  );

  return (
    <form className={s.wrapper} onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Логин" className={s.input} {...register("login")} />
      <div className={s.password}>
        <input
          placeholder="Пароль"
          className={s.input}
          {...register("password")}
          type={showPass ? "text" : "password"}
        />
        <button
          type="button"
          onClick={togglePassword}
          className={clsx("icon-button", s.passToggle)}
        >
          <EyeIcon />
        </button>
      </div>

      <button className={clsx("button-blue", s.button)} type="submit">
        Вход
      </button>
    </form>
  );
});
