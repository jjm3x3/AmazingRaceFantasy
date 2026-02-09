import Link from "next/link";
import GoogleButton from "@/app/components/baseComponents/googleButton/googleButton";
import styles from "./styles.module.scss"

export default async function Login() {

    return (
        <div className="grid place-items-center h-screen">
            <div className="text-center">
                <h3 className="text-xl">Login</h3>
                <GoogleButton 
                    classes={styles.google_login_btn} 
                    googleButtonText="signin" 
                    endpoint="/api/login" 
                    errorMessage="There was an issue logging in. Please try again."
                    testId="google-login-btn"
                />
                <p>Don't have an account? <Link className="standard-link" href={"/create-account"}>Create One</Link>.</p>
            </div>
        </div>
    );
}
