"use client";

import { useState } from "react";
import styles from "./text.module.scss";

const defaultValidationPattern = "^[a-zA-Z()_0-9]+$";

export default function TextInput({
    label,
    placeholder,
    isRequired=false,
    validationPattern=defaultValidationPattern,
    id
}:{
    label: string,
    placeholder: string,
    isRequired: boolean,
    validationPattern?: string,
    id: string
}){
    const [validity, setValidity] = useState(true);
    const inputHandler:React.ChangeEventHandler<HTMLInputElement> = (event)=> {
        event.preventDefault();
        const inputValidity = !!event.currentTarget.value.match(validationPattern);
        if(event.currentTarget.value.length === 0){
            setValidity(true);
        } else {
            setValidity(inputValidity);
        }
    }
    return (
        <div className={`flex-auto ${styles.textComponentContainer}`}>
            <label htmlFor={id} data-testid={`test-label-${id}`} className={styles.label}>{label}</label>
            <div className={styles.inputContainer}>
                <input id={id} 
                    name={id}
                    type="text"
                    data-testid={`test-input-${id}`}
                    pattern={validationPattern}
                    placeholder={placeholder}
                    required={isRequired}
                    className={`${ styles.input } ${validity === false && styles.error}`}
                    onChange={inputHandler}
                />
                {validity === false && <span data-testid={`test-label-${id}-icon`} className={`${styles.error} ${styles.errorIcon}`}>!</span>}
            </div>
            {validity === false && <p data-testid={`test-label-${id}-msg`} className={`${styles.error} ${styles.errorMsg}`}>There is an error</p>}
        </div>
    )
}