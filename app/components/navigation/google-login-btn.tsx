import Script from "next/script";
import { useEffect, useState } from "react";

interface GoogleLogin {
    credential: string,
    select_by: string
}

export default function GoogleLoginButton(){
    const [isWindowLoaded, setIsWindowLoaded] = useState(false);
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
                use_fedcm_for_prompt: true,
                use_fedcm_for_button: true
            });
            const parent = document.getElementById("google_login_btn");
            google.accounts.id.renderButton(parent, {
                theme: "outline",
                text: "signin",
                size: "medium"
            });
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
        <div id="google_login_btn"/>
        <Script async src="https://accounts.google.com/gsi/client"/>
    </>);
}