import { MouseEvent } from "react";
import styles from "./button.module.scss";

export default function Button({
    text,
    kind,
    type="button",
    clickHandler
}:{
    text: string,
    type: "submit" | "reset" | "button",
    kind: "primary" | "secondary",
    clickHandler: (_e: MouseEvent<HTMLButtonElement>) => void
}){
    return (
        <button type={type} className={`${styles[kind]} ${styles.button}`} onMouseUp={clickHandler}>{text}</button>
    )
}