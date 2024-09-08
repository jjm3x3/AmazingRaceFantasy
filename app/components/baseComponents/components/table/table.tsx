import {iTable}  from "../../models/iTable";
import styles from "./table.module.scss";
export default function Table({tableData, tableClassName}:{ tableData: iTable, tableClassName?:String }){
    let headerRow;
    if(tableData.columnNames){
        const headerColumnNames = tableData.columnNames.map(columnValue => <th className={styles.tableCell} scope="col"><strong>{columnValue}</strong></th>)
        headerRow = <thead><tr className={styles.tableHeaderRow}>{headerColumnNames}</tr></thead>;
    }
    const getTableCell = (cellData:string, index:number)=> {
        const isIndex = index === 0;
        const TableCellTag = `t${isIndex ? 'h' : 'd' }` as keyof JSX.IntrinsicElements;
        return <TableCellTag {...(isIndex && {scope: 'row'})} className={styles.tableCell}>
            {cellData}
        </TableCellTag>
    }
    const getTableRow = (tableRow:any[]=[])=> {
        return <tr className={styles.tableRow}>
            {tableRow.map((tableCell, index)=> {
                return getTableCell(tableCell, index);
            })}
        </tr>
    }
    const tableRows = tableData.rows.map((tableRow) => {
        return getTableRow(tableRow);
    })
    let footerRow;
    if(tableData.tableFooter){
        const footerRows = getTableRow(tableData.tableFooter);
        footerRow = <tfoot>{footerRows}</tfoot>
    }
    const classes = [styles.table, tableClassName].join(' ');
    return (
        <table className={classes}>
            {tableData.caption && <caption>{tableData.caption}</caption>}
            {tableData.columnNames && headerRow}
            {tableRows}
            {tableData.tableFooter && footerRow}
        </table>
    );
}