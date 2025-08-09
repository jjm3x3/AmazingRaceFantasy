import styles from "./text.module.scss";

export default function TextInput({
    label,
    placeholder,
    isRequired=false,
    validationPattern="^[a-zA-Z_0-9]+$",
    id
}:{
    label: string,
    placeholder: string,
    isRequired: boolean,
    validationPattern?: string,
    id: string
}){
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