"use client"
import { useEffect, useRef, useContext } from "react";
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
        router.push("/");
    }

    return (<>
        <div ref={googleCreateRef} id="google_login_btn" className={classes}/>
    </>);
}
