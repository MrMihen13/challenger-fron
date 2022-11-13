import clsx from "clsx";
import { FC, PropsWithChildren, useCallback } from "react";
import s from "./styles.module.css";

export type DrawerProps = {
  open: boolean;
  handleClose: () => void;
};

export const Drawer: FC<PropsWithChildren<DrawerProps>> = ({
  open,
  handleClose,
  children
}) => {
  const contentClick = useCallback((e) => {
    e.stopPropagation();
  }, []);
  return (
    <section
      onClick={handleClose}
      className={clsx(s.wrapper, { [s.open]: open })}
    >
      <div onClick={contentClick} className={s.content}>
        {children}
      </div>
    </section>
  );
};
