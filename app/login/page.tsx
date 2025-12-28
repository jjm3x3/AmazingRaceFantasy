import styles from "./styles.module.scss";
import GoogleLoginButton from "@/app/components/navigation/google-login-btn";

export default async function Login() {

    return (
        <div>
            <div className="flex justify-center">
                <p>Already have an account?</p>
            </div>
            <div className="flex justify-center">
                <GoogleLoginButton/>
            </div>
        </div>
    );
}
