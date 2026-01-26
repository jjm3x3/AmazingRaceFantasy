import Link from "next/link";
import GoogleCreateButton from "@/app/components/baseComponents/googleButton/createButton";
import styles from "./styles.module.scss"

export default async function CreateAccount() {

    return (
        <div className="grid place-items-center h-screen">
            <div className="text-center">
                <p className="text-xl">Create Account</p>
                <GoogleCreateButton classes={styles.google_create_btn} />
                <p>Already have an account? <Link className="standard-link" href={"/login"}>Login</Link></p>
            </div>
        </div>
    );
}
