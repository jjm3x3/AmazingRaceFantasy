import { TableData, TableRowItem, TableFooterItem }  from "../../models/tableData";
import styles from "./table.module.scss";

const getTableRow = ({columnNames, tableRow}:{ columnNames: TableRowItem[], tableRow: TableRowItem })=> {
    return <tr className={styles.tableRow} key={`tableRow-${tableRow.name}`}>{
        columnNames.map((columnValue, index) => {
            return <td key={`tableRow-${tableRow.name}-${columnValue.key}-${index}`} className={styles.tableCell}>{tableRow[columnValue.key]}</td>
        })
    }</tr>;
};

export default function Table({tableData, tableClassName}:{ tableData: TableData, tableClassName?:string }){
    let headerRow;
    if(tableData.columnNames){
        const headerColumnNames = tableData.columnNames.map((columnValue: TableRowItem, index: number) => {
            return <th className={styles.tableCell} 
                key={`headerTableCol-${index}`}
                scope="col">
                <strong>{columnValue.value}</strong>
            </th>
        });
        headerRow = <thead><tr className={styles.tableHeaderRow}>{headerColumnNames}</tr></thead>;
    }
    const tableRows = tableData.rows.map((tableRow) => {
        return getTableRow({columnNames: tableData.columnNames, tableRow});
    });
    let footerRow;
    if(tableData.tableFooterContent){
        const footerContent = tableData.tableFooterContent.map((footerCellDetails: TableFooterItem, index: number) => 
            <td colSpan={footerCellDetails.cellWidth} 
                className={styles.tableCell} 
                key={`tableFooterRow-${index}`}>
                <strong>{footerCellDetails.footerValue}</strong>
            </td>);
        footerRow = <tfoot><tr>{footerContent}</tr></tfoot>;
    }
    const classes = [styles.table, tableClassName].join(" ");
    return (
        <table className={classes}>
            {tableData.caption && <caption>{tableData.caption}</caption>}
            {tableData.columnNames && headerRow}
            <tbody>
                {tableRows}
            </tbody>
            {tableData.tableFooterContent && footerRow}
        </table>
    );
}