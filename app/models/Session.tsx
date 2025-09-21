export default interface Session {
    sessionInfo: SessionInfo
    // setIsLoggedIn needs to include void as a type because of useState doesn't return a value directly
    setSessionInfo: (_sessionInfo:SessionInfo)=> boolean | void // eslint-disable-line no-unused-vars
}

interface SessionInfo {
    isLoggedIn: boolean
}
