"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import GoogleButton from "@/app/components/baseComponents/googleButton/googleButton";
import ErrorMessage from "@/app/components/baseComponents/components/errorMessage/errorMessage";
import { setLocalUserData } from "@/app/dataSources/localStorageShim";
import { SessionContext } from "@/app/contexts/session";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";

export default function CreateAccountComponent() {
    const [getError, setError] = useState(false);
    const { setSessionInfo } = useContext(SessionContext);
    const router = useRouter();
    const handleAccountServiceResponse = async (response: Response) => {
        if (response.status === 409) {
            setError(true); // since we are using a boolean we are assuming this is the only error possible at this time
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
                classes={styles.google_create_btn} 
                googleButtonText="signup_with" 
                endpoint="/api/account"
                accountServiceResponseHandler={handleAccountServiceResponse}
            />
            { getError ? <div data-testid="create-account-error">
                <ErrorMessage message={"There was an issue creating an account. Try logging in instead. "}/>
            </div> : <div/> }
            <p>Already have an account? <Link className="standard-link" href={"/login"}>Login</Link>.</p>
        </>
    );
}