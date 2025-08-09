import { useState, KeyboardEvent } from "react";
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
    const [validity, setValidity] = useState(true);
    const validationPatternAsRegexp = new RegExp(validationPattern);
    const inputHandler = (event: KeyboardEvent<HTMLInputElement>)=> {
        const inputValidity =  validationPatternAsRegexp.test(event.currentTarget.value);
        console.log(event.currentTarget.checkValidity());
        if(event.currentTarget.value.length === 0){
            setValidity(true);
        } else {
            setValidity(inputValidity);
        }
    }
    return (
        <div className={`flex-auto ${styles.textComponentContainer}`}>
            <label htmlFor={id} className={styles.label}>{label}</label>
            <div className={styles.inputContainer}>
                <input id={id} 
                    type="text"
                    pattern={validationPattern}
                    placeholder={placeholder}
                    required={isRequired}
                    className={`${ styles.input } ${validity === false && styles.error}`}
                    onKeyUp={inputHandler}
                />
                {validity === false && <span className={`${styles.error} ${styles.errorIcon}`}>!</span>}
            </div>
            {validity === false && <p className={`${styles.error} ${styles.errorMsg}`}>There is an error</p>}
        </div>
    )
}