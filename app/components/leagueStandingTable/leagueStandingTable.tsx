import { Table } from "../baseComponents";
import ContestantRoundList from "../contestantRoundList";
import styles from "./leagueStandingTable.module.scss";

export default function LeagueStandingTable({ leagueData }:{leagueData: any}){
    type rowState = any[];
    const tableColNames: rowState = ["Rank", "Name", "Score"];
    const tableRows: rowState = [];
    const tableData = {
        colsNames: tableColNames,
        rows: tableRows
    }
    leagueData.map((contestantData:any) =>{
        const tableContestantData = [contestantData.name, contestantData.totalScore]
        tableData.rows.push(tableContestantData);
    });

    tableData.rows.sort((a, b) => {
        const aScore = a.filter((param:number|string) => typeof param === "number")[0];
        const bScore = b.filter((param:number|string)=> typeof param === "number")[0];
        return aScore > bScore ? aScore : bScore
    });

    tableData.rows.map((tableRow, index) => {
        return tableRow.unshift(index+1);
    })

    return <Table tableClassName={`flex-auto ${styles.table}`} tableData={tableData}/>
}