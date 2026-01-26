"use client"
import GoogleButton from "./googleButton";

export default function GoogleCreateButton({classes}: {classes: string}){
    return <GoogleButton classes={classes} 
        text="signup_with" 
        endpoint="/api/account" 
        errorMessage="There was an issue creating an account. Try logging in instead"
        testId="create-account-error"/>;
}
