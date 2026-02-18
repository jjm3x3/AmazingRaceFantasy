
import styles from "./errorMessage.module.scss";

export default function ErrorMessage({message}: {message: string}){
    return (
        <p className={`${styles.error} ${styles.errorMsg}`}>
            <span className={`${styles.error} ${styles.errorIcon}`}>!</span>
            { message }
        </p>
    );
}
