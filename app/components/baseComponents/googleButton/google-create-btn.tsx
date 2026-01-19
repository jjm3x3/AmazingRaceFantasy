"use client"
import { useEffect, useRef, useContext, useState } from "react";
import { SessionContext } from "@/app/contexts/session";
import { setLocalUserData } from "@/app/dataSources/localStorageShim";
import config from "@/app/config";
import { useRouter } from "next/navigation";

interface GoogleLogin {
    credential: string,
    select_by: string
}

export default function GoogleCreateButton({classes}: {classes: string}){
    const { setSessionInfo, googleSdkLoaded } = useContext(SessionContext);
    const googleCreateRef = useRef(null);
    const router = useRouter();
    const [getError, setError] = useState(false);

    useEffect(()=> {
        if(googleSdkLoaded && window.google){
            const google = window.google;
            google.accounts.id.initialize({
                client_id: config.googleAuthClientId,
                callback: handleCredentialResponse,
                use_fedcm_for_prompt: true
            });
            const parent = googleCreateRef.current;
            if(googleCreateRef && parent){
                google.accounts.id.renderButton(parent, {
                    text: "signup_with",
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
        fetch("/api/account", {
            method: "POST",
            body: JSON.stringify({ token: response.credential }),
        }).then(handleLogin);
    }

    async function handleLogin(response: Response) {
        if (response.status === 409) {
            console.error("That account already exists, try logging in");
            setError(true);
        } else {
            const data = await response.json();
            setLocalUserData({userName: data.name.firstName, googleUserId: data.googleUserId});
            setSessionInfo({isLoggedIn: true, userName: data.name.firstName, googleUserId: data.googleUserId});
            router.push("/");
        }
    }

    return (<>
        <div ref={googleCreateRef} id="google_create_btn" className={classes}/>
        { getError ? <div>
            <p>There was an error</p>
        </div> : <div/> }
    </>);
}
