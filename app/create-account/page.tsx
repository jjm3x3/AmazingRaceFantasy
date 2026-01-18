import GoogleLoginButton from "@/app/components/navigation/google-login-btn";
import styles from "./styles.module.scss"

export default async function CreateAccount() {

    return (
        <div className="grid place-items-center h-screen">
            <div className="text-center">
                <p className="text-xl">Create Account</p>
                <GoogleLoginButton classes={styles.google_login_btn} />
                <p>Already have an account? Login</p>
            </div>
        </div>
    );
}
