"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import GoogleButton from "@/app/components/baseComponents/googleButton/googleButton";
import ErrorMessage from "@/app/components/baseComponents/components/errorMessage/errorMessage";
import { setLocalUserData } from "@/app/dataSources/localStorageShim";
import { SessionContext } from "@/app/contexts/session";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss"

export default function LoginComponent() {
    const [getError, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { setSessionInfo } = useContext(SessionContext);
    const router = useRouter();
    const handleAccountServiceResponse = async (response: Response) => {
        if (response.status === 404) {
            setErrorMessage("There was no account found. Try creating one.")
            setError(true);
        } else if (response.status === 401) {
            setErrorMessage("There was an issue logging in. Please try again.");
            setError(true);
        } else {
            const data = await response.json();
            setLocalUserData({userName: data.name.firstName, googleUserId: data.googleUserId});
            setSessionInfo({isLoggedIn: true, userName: data.name.firstName, googleUserId: data.googleUserId});
            router.push("/");
        }
    }
    return (
        <>
            <GoogleButton 
                classes={styles.google_login_btn} 
                googleButtonText="signin" 
                endpoint="/api/login" 
                accountServiceResponseHandler={handleAccountServiceResponse}
            />
            { getError ? <div data-testid="login-error">
                <ErrorMessage message={errorMessage}/>
            </div> : <div/> }
            <p>Don't have an account? <Link className="standard-link" href={"/create-account"}>Create One</Link>.</p>
        </>
    )
}