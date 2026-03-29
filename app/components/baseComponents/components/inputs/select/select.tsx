import styles from "./select.module.scss";

interface SelectOption {
    value: string,
    text: string,
    id?: string,
    selected?: boolean
}

export default function Select({ 
    labelText,
    placeholder,
    selectOptions,
    changeHandler,
    id
}:{
    labelText: string,
    placeholder?: string,
    selectOptions: SelectOption[],
    changeHandler?: (_e: React.ChangeEvent<HTMLSelectElement>) => void,
    id: string
}){
    return (
        <div className={styles.dropdownContainer}>
            <label className={styles.label} htmlFor={id}>{labelText}</label>
            <select className={styles.dropdown} id={id} data-testid={`test-select-${id}`} name={id} onChange={changeHandler}>
                {placeholder && <option id="placeholder" selected disabled>{placeholder}</option>}
                {selectOptions.map(option=> {
                    return (
                        <option key={`${id}-option-${option.value}`} value={option.value}>{option.text}</option>
                    )
                })}
            </select>
        </div>
    );
}