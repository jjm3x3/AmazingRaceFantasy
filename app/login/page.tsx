import GoogleLoginButton from "@/app/components/navigation/google-login-btn";

export default async function Login() {

    return (
        <div className="grid place-items-center h-screen">
            <div>
                <p>Login</p>
                <GoogleLoginButton/>
            </div>
        </div>
    );
}
