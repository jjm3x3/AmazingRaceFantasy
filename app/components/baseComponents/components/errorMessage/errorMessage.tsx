export default function ErrorMessage({message}: {message: string}){
    return (
        <div>
            <p className={`${styles.error} ${styles.errorMsg}`}>
                <span className={`${styles.error} ${styles.errorIcon}`}>!</span>
                { message }
            </p>
        </div>
    );
}