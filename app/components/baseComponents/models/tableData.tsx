export interface TableFooterItem {
    footerValue: string,
    cellWidth: number
}

export interface TableRowItem {
    rank?: number,
    name: string,
    totalScore: number,
    roundScore?: number
}

export interface TableData {
    caption?: string, 
    columnNames: Array<string>,
    rows: TableRowItem[],
    tableFooterContent?: TableFooterItem[]
}