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

interface IAttribute {
    inputAttr: IInputAttribute
    labelAttr: ILabelAttribute
    listAttr: IListAttribute
}

export default interface INavigationItem{ 
    attrs: IAttribute
    children: any
    hasSubpages: boolean
}
