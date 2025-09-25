
interface LocalUserData {
    userName: string
    googleUserId: string
}

export function setLocalUserData(userData: LocalUserData) {
    localStorage.setItem("userName", userData.userName);
    localStorage.setItem("googleUserId", userData.googleUserId);
}

export function getLocalUserData(): LocalUserData {
    const userData: LocalUserData = {
        userName: "Default User Name From localStorageShim",
        googleUserId: "xxx-xxx-xxx"
    };
    userData.userName = localStorage.getItem("userName") ?? userData.userName;
    userData.googleUserId = localStorage.getItem("googleUserId") ?? userData.googleUserId;
    return userData;
}

export function clearLocalStorage() {
    localStorage.clear();
}
