import GoogleLoginButton from "@/app/components/navigation/google-login-btn";

export default async function Login() {

    return (
        <div>
            <div className="flex justify-center">
                <p>Login</p>
            </div>
            <div className="flex justify-center">
                <GoogleLoginButton/>
            </div>
        </div>
    );
}
