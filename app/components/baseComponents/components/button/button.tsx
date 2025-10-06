import { MouseEvent } from "react";
import styles from "./button.module.scss";

export default function Button({
    text,
    kind,
    id="",
    type="button",
    disabled=false,
    clickHandler
}:{
    text: string,
    type: "submit" | "reset" | "button",
    kind: "primary" | "secondary",
    id: string,
    clickHandler: (_e: MouseEvent<HTMLButtonElement>) => void,
    disabled?: boolean
}){
    return (
        <button type={type} 
                id={id} 
                data-testid={`test-button-${id}`} 
                className={`${styles[kind]} ${styles.button} ${disabled && 'disabled:opacity-50 disabled:cursor-not-allowed'}`} 
                onClick={clickHandler}
                disabled={disabled}>{text}</button>
    )
}