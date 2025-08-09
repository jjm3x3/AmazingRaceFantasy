"use client"

export default function LogoutButton(){

    function performLogout() {
        fetch("/api/logout", {
            method: "POST"
        }).then((resp) => {
            console.log(resp);
        });
    }

    return (<>
        <button onClick={performLogout}>Log Out</button>
    </>);
}
