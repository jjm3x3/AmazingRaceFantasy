import { Table } from "../baseComponents";

import styles from "./leagueStandingTable.module.scss";

export default async function LeagueStandingTable({ contestantsScores }:{contestantsScores: any}){
    type rowState = any[];
    const tableColNames: rowState = ["Rank", "Name", "Score"];
    const tableRows: rowState = [];
    const tableData = {
        colsNames: tableColNames,
        rows: tableRows
    }

    contestantsScores.forEach((contestantData:any) =>{
        const { content: { props }} = contestantData;
        const contestantRoundScores = props.contestantRoundScores;
        const contestantRoundTotalScore = contestantRoundScores.at(-1).contestantRoundData[0].totalScore;
        const tableContestantData = [props.contestantName, contestantRoundTotalScore]
        tableData.rows.push(tableContestantData);
    });

    tableData.rows.sort((a, b) => {
        const aScore = a.filter((param:number|string) => typeof param === "number")[0];
        const bScore = b.filter((param:number|string)=> typeof param === "number")[0];
        const scoreToReturn = aScore > bScore ? -1 : 1;
        return scoreToReturn;
    });

    tableData.rows.map((tableRow, index) => {
        return tableRow.unshift(index+1);
    })

    return <Table tableClassName={`flex-auto ${styles.table}`} tableData={tableData}/>
}