import Link from "next/link";
import GoogleLoginButton from "@/app/components/navigation/google-login-btn";
import styles from "./styles.module.scss"

export default async function Login() {

    return (
        <div className="grid place-items-center h-screen">
            <div className="text-center">
                <p className="text-xl">Login</p>
                <GoogleLoginButton classes={styles.google_login_btn} />
                <p>Don't have an account? <Link className="standard-link" href={"/create-account"}>Create One</Link></p>
            </div>
        </div>
    );
}
