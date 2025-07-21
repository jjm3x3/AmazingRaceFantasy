export default interface Session {
    isLoggedIn: boolean,
    setIsLoggedIn: (isLoggedIn:boolean)=> boolean | void // eslint-disable-line no-unused-vars
}