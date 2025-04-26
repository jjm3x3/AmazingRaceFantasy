import { generateContestantRoundScores } from "@/app/generators/contestantRoundScoreGenerator"
import { getTeamList } from "@/app/utils/wikiQuery"

describe("Regression Tests Checking generation of Archived Leagues", () => {

    it("Should return a league with rachels scoring for AmazingRace_35", () => {

        const testDataFetcher = () => new Promise((resolve, _reject) => {
            resolve(
                [{"name":"someTeamName"}]
            );
        });

        const rachelsRawTeamList = [ "Ashlie Martin & Todd Martin", "Jocelyn Chao & Victor Limary", "Garrett Smith & Joel Strasser", "Lena Franklin & Morgan Franklin", "Ian Todd & Joe Moskowitz", "Corey McArthur & Rob McArthur", "Greg Franklin & John Franklin", "Liam Hykel & Yeremi Hykel", "Anna Leigh Wilson & Steve Cargile", "Andrea Simpson & Malaina Hatcher", "Chelsea Day & Robbin Tomich", "Elizabeth Rivera & Iliana Rivera", "Alexandra Lichtor & Sheridan Lichtor" ]

        const rachelsContestantLeagueData = {
            name: "Rachel",
            userId: "E3BA8CF1-0F66-4911-88D8-A9ECFEEB37A7",
            ranking: rachelsRawTeamList,
        };
        const listOfContetantLeagueData = [rachelsContestantLeagueData]

        // Act
        generateContestantRoundScores(testDataFetcher, getTeamList, listOfContetantLeagueData);
    });
});
