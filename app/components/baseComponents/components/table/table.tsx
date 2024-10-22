import { TableData }  from "../../models/tableData";
import styles from "./table.module.scss";
export default function Table({tableData, tableClassName}:{ tableData: TableData, tableClassName?:String }){
    let headerRow;
    if(tableData.columnNames){
        const headerColumnNames = tableData.columnNames.map(columnValue => <th className={styles.tableCell} scope="col"><strong>{columnValue}</strong></th>)
        headerRow = <thead><tr className={styles.tableHeaderRow}>{headerColumnNames}</tr></thead>;
    }
    const getTableRow = (tableRow:any={})=> {
        return <tr className={styles.tableRow}>
            <th className={styles.tableCell}>{tableRow.rank}</th>
            <td className={styles.tableCell}>{tableRow.name}</td>
            <td className={styles.tableCell}>{tableRow.totalScore}</td>
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