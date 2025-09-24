import { MouseEvent } from "react";
import styles from "./button.module.scss";

export default function Button({
    text,
    kind,
    id="",
    type="button",
    clickHandler
}:{
    text: string,
    type: "submit" | "reset" | "button",
    kind: "primary" | "secondary",
    id: string,
    clickHandler: (_e: MouseEvent<HTMLButtonElement>) => void
}){
    return (
        <button type={type} id={id} data-testid={`test-button-${id}`} className={`${styles[kind]} ${styles.button}`} onClick={clickHandler}>{text}</button>
    )
}