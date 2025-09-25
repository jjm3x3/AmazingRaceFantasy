
interface LocalUserData {
    userName: string
    googleUserId: string
}

export function setLocalUserData(userData: LocalUserData) {
    localStorage.setItem("userName", userData.userName);
    localStorage.setItem("googleUserId", userData.googleUserId);
}
