import { ReactNode } from "react";

interface IAriaAttr {
    controls: string
}

interface IInputAttribute {
    id: string
    classes: string
}

interface ILabelAttribute {
    id: string
    classes: string
    aria: IAriaAttr
    testId: string
    content: React.ReactNode
}

interface IListAttribute {
    id: string
    testId: string
    classes: string
}

export default interface INavigationItem{ 
    inputAttr: IInputAttribute
    labelAttr: ILabelAttribute
    listAttr: IListAttribute
    children: ReactNode
    hasSubpages: boolean
};
