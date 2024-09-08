export interface iTableFooterItem {
    footerValue: string,
    cellWidth: number

}

export interface iTableFooter {
    rows: iTableFooterItem[]
}

export interface iTable {
    caption?: string, 
    columnNames: Array<String>,
    rows: any[],
    tableFooter?: iTableFooter[]
}