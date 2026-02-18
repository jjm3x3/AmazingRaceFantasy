import Link from "next/link";
import GoogleButton from "@/app/components/baseComponents/googleButton/googleButton";
import styles from "./styles.module.scss"

export default async function CreateAccount() {

    return (
        <div className="grid place-items-center h-screen">
            <div className="text-center">
                <h3 className="text-xl">Create Account</h3>
                <GoogleButton 
                    classes={styles.google_create_btn} 
                    googleButtonText="signup_with" 
                    endpoint="/api/account" 
                    errorMessage="There was an issue creating an account. Try logging in instead. "
                    testId="create-account-error"
                />
                <p>Already have an account? <Link className="standard-link" href={"/login"}>Login</Link>.</p>
            </div>
        </div>
    );
}
