import Script from "next/script";
import { useEffect, useState, useRef } from "react";

interface GoogleLogin {
    credential: string,
    select_by: string
}

export default function GoogleLoginButton(){
    const [isWindowLoaded, setIsWindowLoaded] = useState(false);
    const googleLoginRef = useRef();

    useEffect(()=> {
        if(typeof window !== "undefined"){
            setIsWindowLoaded(true)
        }
    }, [typeof window]);

    useEffect(()=> {
        if(isWindowLoaded){
            const google = window.google;
            google.accounts.id.initialize({
                client_id: "708154320268-432vdrg2g0h1652frag5vbu8r8qi4ers.apps.googleusercontent.com",
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
    }, [isWindowLoaded]);
    
    function handleCredentialResponse(response:GoogleLogin) {
        fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ token: response.credential }),
        }).then(handleLogin);
    }

    async function handleLogin(response: Response) {
        const data = await response.json();
        console.log(data);
    }

    return (<>
        <div ref={googleLoginRef} id="google_login_btn"/>
        <Script async src="https://accounts.google.com/gsi/client"/>
    </>);
}