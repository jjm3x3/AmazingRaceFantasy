export default interface Session {
    isLoggedIn: boolean,
    // setIsLoggedIn needs to include void as a type because of useState doesn't return a value directly
    setIsLoggedIn: (_isLoggedIn:boolean)=> boolean | void // eslint-disable-line no-unused-vars
}