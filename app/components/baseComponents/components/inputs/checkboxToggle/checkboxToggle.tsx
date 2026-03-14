import styles from "./checkboxToggle.module.scss";

export default function CheckboxToggle({ 
    labelText,
    toggleHandler,
    checkboxPosition,
    id
}:{
    labelText: string,
    toggleHandler: () => void,
    checkboxPosition: "left" | "right",
    id: string
}){
    const checkboxElement = <input className={styles.checkbox} id={id} data-testid={`test-checkboxToggle-${id}`} type="checkbox" onChange={toggleHandler}/>;
    return (
        <div className={styles.dropdownContainer}>
            {checkboxPosition === "left" && checkboxElement}
            <label className={styles.checkboxLabel} htmlFor={id} data-testid={`test-checkboxToggle-label-${id}`}>
                {labelText}
            </label>
            {checkboxPosition === "right" && checkboxElement}
        </div>
    );
}