import { Table } from "../baseComponents";

import styles from "./leagueStandingTable.module.scss";

export default async function LeagueStandingTable({ contestantsScores }:{contestantsScores: any}){
    const tableColumnNames: any[] = ["Rank", "Name", "Score"];
    const tableData = {
        columnNames: tableColumnNames,
        rows: contestantsScores.at(-1).contestantRoundData
    }

    tableData.rows.sort((a: any, b: any) => {
        const aScore = a.totalScore;
        const bScore = b.totalScore;
        const scoreToReturn = aScore > bScore ? -1 : 1;
        return scoreToReturn;
    });

    tableData.rows.map((tableRow: any, index: number) => {
        const tableRowWithRank = tableRow;
        tableRowWithRank['rank'] = index + 1;
        return tableRowWithRank;
    });

    return <Table tableClassName={`flex-auto ${styles.table}`} tableData={tableData}/>
}