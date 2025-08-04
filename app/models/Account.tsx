export interface UserType {
    email: string,
    name: {
        firstName: string,
        lastName: string
    }
}
export interface AccountContextType {
    user: UserType
}