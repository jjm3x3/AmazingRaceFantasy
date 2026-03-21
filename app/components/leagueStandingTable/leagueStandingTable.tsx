import { Table } from "../baseComponents";
import { TableRowItem } from "../baseComponents/models/tableData";
import styles from "./leagueStandingTable.module.scss";

interface ContestantRoundData {
    name: string,
    roundScore: number,
    totalScore: number
}

interface TableDataItem {
    round: number,
    contestantRoundData: ContestantRoundData[]
}

interface TableHeaderItem {
    key: string,
    value: string
}

export default async function LeagueStandingTable({ contestantsScores }:{ contestantsScores: TableDataItem[] }){
    const tableColumnNames: TableHeaderItem[] = [{
        key: "rank",
        value: "Rank"
    }, {
        key: "name",
        value: "Name"
    }, {
        key: "roundScore",
        value: "Round Score"
    }, {
        key: "totalScore",
        value: "Total Score"
    }];
    const defaultTableDataItem: TableDataItem = Object.create(null);
    const mostRecentScore = contestantsScores.at(-1) ?? defaultTableDataItem;
    const tableData = {
        columnNames: tableColumnNames,
        rows: mostRecentScore.contestantRoundData
    };

    tableData.rows.sort((a: ContestantRoundData, b: ContestantRoundData) => {
        const aScore = a.totalScore;
        const bScore = b.totalScore;
        const sortIndicator = aScore > bScore ? -1 : 1;
        return sortIndicator;
    });

    tableData.rows.map((tableRow: TableRowItem, index: number) => {
        const tableRowWithRank = tableRow;
        tableRowWithRank["rank"] = index + 1;
        return tableRowWithRank;
    });

    return <Table tableClassName={`flex-auto ${styles.table}`} tableData={tableData}/>;
}