export interface TableFooterItem {
    footerValue: string,
    cellWidth: number
}

export interface TableRowItem {
    rank: string,
    name: string,
    totalScore: number
}

export interface TableData {
    caption?: string, 
    columnNames: Array<string>,
    rows: TableRowItem[],
    tableFooterContent?: TableFooterItem[]
}