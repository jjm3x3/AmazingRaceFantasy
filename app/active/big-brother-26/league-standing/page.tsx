import { WIKI_API_URL } from '../../../leagueConfiguration/BigBrother_26'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/BigBrother_26'
import { getWikipediaContestantDataFetcher } from '../../../utils/wikiFetch'
import { getCompetingEntityList } from "../../../utils/wikiQuery"
import generateListOfContestantRoundLists from '../../../generators/contestantRoundListGenerator'
import LeagueStandingTable from '../../../components/leagueStandingTable/leagueStandingTable';

export default async function LeagueStanding() {
    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL, "HouseGuests")

    const listOfContestantRoundLists = await generateListOfContestantRoundLists(dataFetcher, CONTESTANT_LEAGUE_DATA, getCompetingEntityList)
    // type rowState = any[];
    // const tableColNames: rowState = ["Rank", "Name", "Score"];
    // const tableRows: rowState = [];
    // const tableData = {
    //     colsNames: tableColNames,
    //     rows: tableRows
    // }
    // listOfContestantRoundLists.map(contestantData =>{
    //     const tableContestantData = [contestantData.content.props.contestantName, contestantData.content.props.contestantRoundScores[contestantData.content.props.contestantRoundScores.length - 1].contestantRoundData[0].totalScore]
    //     tableData.rows.push(tableContestantData);
    // });

    // tableData.rows.sort((a, b) => {
    //     const aScore = a.filter((param:number|string) => typeof param === "number")[0];
    //     const bScore = b.filter((param:number|string)=> typeof param === "number")[0];
    //     return aScore > bScore ? aScore : bScore
    // });

    // tableData.rows.map((tableRow, index) => {
    //     return tableRow.unshift(index+1);
    // })

    return <>
        <h1 className="text-3xl text-center">League Standing</h1>
        <br/>
        <LeagueStandingTable leagueData={listOfContestantRoundLists} />
    </>
}