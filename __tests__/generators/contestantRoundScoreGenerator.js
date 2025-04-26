import { generateContestantRoundScores } from "@/app/generators/contestantRoundScoreGenerator"
import { getTeamList } from "@/app/utils/wikiQuery"

describe("Regression Tests Checking generation of Archived Leagues", () => {

    it("Should return a league with rachels scoring for AmazingRace_35", () => {

        const testDataFetcher = () => new Promise((resolve, _reject) => {
            resolve(
                [{"name":"someTeamName"}]
            );
        });

        // Act
        generateContestantRoundScores(testDataFetcher);
    });
});
