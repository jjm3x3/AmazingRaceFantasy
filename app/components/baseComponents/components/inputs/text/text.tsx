import styles from "./text.module.scss";

export default function TextInput({
    label,
    placeholder,
    isRequired=false,
    inputType="text",
    id
}:{
    label: string,
    placeholder: string,
    isRequired: boolean,
    inputType: string,
    id: string
}){
    const textValidationPattern = "^[A-Za-z0-9 ]+$";
    const numberValidationPattern = "^[0-9]$"
    const validationPattern = inputType === "number" ? numberValidationPattern : textValidationPattern;
    return (
        <div className={`flex-auto ${styles.inputContainer}`}>
            <label htmlFor={id} className={styles.label}>{label}</label>
            <input id={id} 
                   type="text"
                   placeholder={placeholder}
                   required={isRequired}
                   className={styles.input}
                   pattern={validationPattern}/>
        </div>
    )
}