import clsx from "clsx";
import { FC } from "react";
import s from "./styles.module.css";

export const Header: FC = () => {
  return (
    <header className={s.wrapper}>
      <nav className={clsx("container", s.content)}>-</nav>
    </header>
  );
};
