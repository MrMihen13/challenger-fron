import { FC } from "react";
import s from "./styles.module.css";

export const Loader: FC = () => (
  <div className={s["lds-ellipsis"]}>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
);
