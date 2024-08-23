import { Table } from "../baseComponents";
import { getWikipediaContestantDataFetcher } from "@/app/utils/wikiFetch";
import generateListOfContestantRoundLists from '@/app/generators/contestantRoundListGenerator'
import { getCompetingEntityList } from "@/app/utils/wikiQuery"

import styles from "./leagueStandingTable.module.scss";

export default async function LeagueStandingTable({ wikiApiURL, sectionTitle, contestantLeagueData }:{wikiApiURL: string, sectionTitle:string, contestantLeagueData: any}){
    type rowState = any[];
    const tableColNames: rowState = ["Rank", "Name", "Score"];
    const tableRows: rowState = [];
    const tableData = {
        colsNames: tableColNames,
        rows: tableRows
    }

    const dataFetcher = getWikipediaContestantDataFetcher(wikiApiURL, sectionTitle);
    let contestantsScores;
    if(wikiApiURL.includes("Big_Brother")){
        contestantsScores = await generateListOfContestantRoundLists(dataFetcher, contestantLeagueData, getCompetingEntityList);
    } else {
        contestantsScores = await generateListOfContestantRoundLists(dataFetcher, contestantLeagueData);
    }
    
    contestantsScores.map((contestantData:any) =>{
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