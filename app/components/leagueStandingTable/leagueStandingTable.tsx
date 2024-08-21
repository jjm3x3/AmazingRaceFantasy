import { Table } from "../baseComponents";
import { getWikipediaContestantDataFetcher } from "@/app/utils/wikiFetch";
import { generateContestantRoundScores } from "@/app/generators/contestantRoundScoreGenerator";
import styles from "./leagueStandingTable.module.scss";

export default async function LeagueStandingTable({ wikiApiURL, sectionTitle, contestantLeagueData, competeAsTeam }:{wikiApiURL: string, sectionTitle:string, contestantLeagueData: any, competeAsTeam: boolean}){
    type rowState = any[];
    const tableColNames: rowState = ["Rank", "Name", "Score"];
    const tableRows: rowState = [];
    const tableData = {
        colsNames: tableColNames,
        rows: tableRows
    }

    const dataFetcher = getWikipediaContestantDataFetcher(wikiApiURL, sectionTitle);
    const contestantsScoresData = await generateContestantRoundScores(dataFetcher, contestantLeagueData, competeAsTeam);
    const contestantsScores = contestantsScoresData.rounds[contestantsScoresData.rounds.length-1].contestantRoundData;
    
    contestantsScores.map((contestantData:any) =>{
        const tableContestantData = [contestantData.name, contestantData.totalScore]
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