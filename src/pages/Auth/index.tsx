import clsx from "clsx";
import { AuthForm } from "./form";
import s from "./styles.module.css";

export const AuthPage = () => {
  return (
    <div className={clsx("container", s.wrapper)}>
      <h3 className={s.title}>Добро пожаловать в Advisory</h3>
      <AuthForm />
    </div>
  );
};
