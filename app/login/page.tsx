import GoogleLoginButton from "@/app/components/navigation/google-login-btn";

export default async function Login() {

    return (
        <div className="grid place-items-center h-screen">
            <div className="text-center">
                <p className="text-xl">Login</p>
                <GoogleLoginButton />
                <p>Don't have an account? Create One.</p>
            </div>
        </div>
    );
}
