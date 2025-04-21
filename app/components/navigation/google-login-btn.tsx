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
            const parent = document.getElementById('google_login_btn');
            google.accounts.id.renderButton(parent, {
                theme: "outline",
                size: "large"
            });
        }
    }, [isWindowLoaded])
    
    function handleCredentialResponse(response:GoogleLogin) {
        const responsePayload = decodeJwtResponse(response.credential);
   
        console.log("ID: " + responsePayload.sub);
        console.log('Full Name: ' + responsePayload.name);
        console.log('Given Name: ' + responsePayload.given_name);
        console.log('Family Name: ' + responsePayload.family_name);
        console.log("Image URL: " + responsePayload.picture);
        console.log("Email: " + responsePayload.email);
    }
   
    function decodeJwtResponse(token:string) {
       let base64Url = token.split('.')[1];
       let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
       let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
           return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
       }).join(''));
   
       return JSON.parse(jsonPayload);
    }

    return (<>
        <div id="google_login_btn"/>
        <Script async src="https://accounts.google.com/gsi/client"/>
    </>);
}