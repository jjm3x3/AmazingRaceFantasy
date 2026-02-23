import CreateAccountComponent from "@/app/components/createAccountComponent/createAccountComponent";

export default async function CreateAccount() {
    return (
        <div className="grid place-items-center h-screen">
            <div className="text-center">
                <h3 className="text-xl">Create Account</h3>
                <CreateAccountComponent />
            </div>
        </div>
    );
}
