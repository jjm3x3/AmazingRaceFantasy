"use client"
import { useEffect, useRef, useContext } from "react";
import { SessionContext } from "@/app/contexts/session";
import { setLocalUserData } from "@/app/dataSources/localStorageShim";

interface GoogleLogin {
    credential: string,
    select_by: string
}

export default function GoogleLoginButton({ setShouldNavigateClose }:{ setShouldNavigateClose: (_e: boolean) => void}){
    const { setSessionInfo, googleSdkLoaded } = useContext(SessionContext);
    const googleLoginRef = useRef(null);

    useEffect(()=> {
        if(googleSdkLoaded && window.google){
            const google = window.google;
            google.accounts.id.initialize({
                client_id: "43091874093-mphj7iu8lffvm04ft4qru0sl3ekfjl00.apps.googleusercontent.com",
                callback: handleCredentialResponse,
                use_fedcm_for_prompt: true
            });
            const parent = googleLoginRef.current;
            if(googleLoginRef && parent){
                google.accounts.id.renderButton(parent, {
                    text: "signin",
                    size: "medium",
                    logo_alignment: "left",
                    shape: "rectangular",
                    theme: "outline",
                    type: "standard"
                });
            }
        }
    }, [googleSdkLoaded]);
    
    function handleCredentialResponse(response:GoogleLogin) {
        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ token: response.credential }),
        }).then(handleLogin);
    }

    async function handleLogin(response: Response) {
        const data = await response.json();
        setLocalUserData({userName: data.name.firstName, googleUserId: data.googleUserId});
        setSessionInfo({isLoggedIn: true, userName: data.name.firstName, googleUserId: data.googleUserId});
        setShouldNavigateClose(true);
    }

    return (<>
        <div ref={googleLoginRef} id="google_login_btn"/>
    </>);
}
