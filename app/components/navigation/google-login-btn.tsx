"use client"
import Script from "next/script";
import { useEffect, useState, useRef, useContext } from "react";
import { SessionContext } from "@/app/contexts/session";

interface GoogleLogin {
    credential: string,
    select_by: string
}

export default function GoogleLoginButton(){
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const handleScriptLoad = () => {
        setScriptLoaded(true);
    };
    const { setSessionInfo } = useContext(SessionContext);
    const googleLoginRef = useRef(null);

    useEffect(()=> {
        if(scriptLoaded){
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
    }, [scriptLoaded]);
    
    function handleCredentialResponse(response:GoogleLogin) {
        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ token: response.credential }),
        }).then(handleLogin);
    }

    async function handleLogin(response: Response) {
        const data = await response.json();
        setSessionInfo({isLoggedIn: true, userName: data.name.firstName});
        console.log(data);
    }

    return (<>
        <div ref={googleLoginRef} id="google_login_btn"/>
        <Script async src="https://accounts.google.com/gsi/client" onLoad={handleScriptLoad}/>
    </>);
}
