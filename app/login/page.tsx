import LoginComponent from "@/app/components/loginComponent/loginComponent";

export default async function Login() {
    return (
        <div className="grid place-items-center h-screen">
            <div className="text-center">
                <h3 className="text-xl">Login</h3>
                <LoginComponent />
            </div>
        </div>
    );
}
