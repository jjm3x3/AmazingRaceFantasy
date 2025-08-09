import styles from "./button.module.scss";

export default function Button({
    text,
    kind,
    clickHandler
}:{
    text: string,
    kind: "primary" | "secondary",
    clickHandler: () => void
}){
    return (
        <button type="submit" className={`${styles[kind]} ${styles.button}`} onMouseUp={clickHandler}>{text}</button>
    )
}