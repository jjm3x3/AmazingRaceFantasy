"use client";

import { useState, Dispatch, SetStateAction } from "react";
import styles from "./text.module.scss";

const defaultValidationPattern = "^[a-zA-Z()_0-9]+$";

export default function TextInput({
    label,
    placeholder,
    updateFormValidation,
    id,
    getFormValidity,
    isRequired=false,
    validationPattern=defaultValidationPattern,
    defaultValue="",
    isDisabled=false
}:{
    label: string,
    placeholder: string,
    updateFormValidation?: Dispatch<SetStateAction<boolean>>,
    id: string
    getFormValidity:()=> boolean,
    isRequired: boolean,
    validationPattern?: string,
    defaultValue?: string,
    isDisabled?: boolean,
}){
    // A pre-filled value is checked up front so stored data that no longer validates shows as an error
    const [validity, setValidity] = useState(defaultValue.length === 0 || !!defaultValue.match(validationPattern));
    const inputHandler:React.ChangeEventHandler<HTMLInputElement> = (event)=> {
        event.preventDefault();
        const inputValidity = !!event.currentTarget.value.match(validationPattern);
        if(event.currentTarget.value.length === 0){
            setValidity(true);
        } else {
            setValidity(inputValidity);
        }
        updateFormValidation && updateFormValidation(getFormValidity());
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
                    defaultValue={defaultValue}
                    disabled={isDisabled}
                    className={`${ styles.input } ${validity === false && styles.error}`}
                    onChange={inputHandler}
                />
                {validity === false && <span data-testid={`test-label-${id}-icon`} className={`${styles.error} ${styles.errorIcon}`}>!</span>}
            </div>
            {validity === false && <p data-testid={`test-label-${id}-errorMsg`} className={`${styles.error} ${styles.errorMsg}`}>There is an error</p>}
        </div>
    )
}