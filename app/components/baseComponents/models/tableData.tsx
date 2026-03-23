export interface TableFooterItem {
    footerValue: string,
    cellWidth: number
}

export interface TableRowItem {
    [key: string]: string | number
}

export interface TableData {
    caption?: string, 
    columnNames: TableRowItem[],
    rows: TableRowItem[],
    tableFooterContent?: TableFooterItem[]
}