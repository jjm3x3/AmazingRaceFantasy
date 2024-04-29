import ISubpage from "./ISubpage"

export default interface IPage { 
    name: string
    subpages: ISubpage[]
}