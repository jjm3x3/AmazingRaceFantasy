import LeagueStanding from "../../app/models/LeagueStanding";
import Team from "../../app/models/Team";

describe("generateContestantRoundScores", () => {
    it("Should work with simple defaults", () => {
        // Arrange
        const teamList  = [];
        const rounds = 0;

        // Act
        const result = LeagueStanding.generateContestantRoundScores(teamList, rounds, "");

        // Assert
        expect(result).not.toBeNull();
        expect(result.length).toBe(0);
    });

    it("Should work with one round", () => {
        // Arrange
        const teamList  = [];
        const rounds = 1;

        // Act
        const result = LeagueStanding.generateContestantRoundScores(teamList, rounds, "");

        // Assert
        expect(result).not.toBeNull();
        expect(result.length).toBe(1);
        expect(result[0].contestantRoundData).not.toBeNull();
        expect(result[0].contestantRoundData.length).toBe(1);
    });

    it("Should work with one round and one team in the ranking", () => {
        // Arrange
        const teamList = [new Team({teamName: "name1_1 & name1_2"})];
        const rounds = 1;

        // Act
        const result = LeagueStanding.generateContestantRoundScores(teamList, rounds, "");

        // Assert
        expect(result).not.toBeNull();
        expect(result.length).toBe(1);
        expect(result[0].contestantRoundData).not.toBeNull();
        expect(result[0].contestantRoundData.length).toBe(1);
    });

    it("Should output some score when there is one", () => {
        // Arrange
        let exampleTeam = new Team({teamName: "name1_1 & name1_2", isParticipating: true, eliminationOrder: 0});
        let exampleTeam2 = new Team({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 0});

        const teamList = [exampleTeam, exampleTeam2];
        const rounds = 1;

        // Act
        const result = LeagueStanding.generateContestantRoundScores(teamList, rounds, "");

        // Assert
        expect(result).not.toBeNull();
        expect(result.length).toBe(1);
        expect(result[0]).not.toBeNull();
        expect(result[0].contestantRoundData).not.toBeNull();
        expect(result[0].contestantRoundData.length).toBe(1);
        expect(result[0].contestantRoundData[0].roundScore).toBe(10);
        expect(result[0].contestantRoundData[0].totalScore).toBe(10);
    });

    it("Should add multiple teams to one round score when the shouldBeScored", () => {
        // Arrange
        let exampleTeam = new Team({teamName: "name1_1 & name1_2", isParticipating: true, eliminationOrder: 0});
        let exampleTeam2 = new Team({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 0});
        let exampleTeam3 = new Team({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 0});

        const teamList = [exampleTeam, exampleTeam2, exampleTeam3];
        const rounds = 1;

        // Act
        const result = LeagueStanding.generateContestantRoundScores(teamList, rounds, "");

        // Assert
        expect(result).not.toBeNull();
        expect(result.length).toBe(1);
        expect(result[0]).not.toBeNull();
        expect(result[0].contestantRoundData).not.toBeNull();
        expect(result[0].contestantRoundData.length).toBe(1);
        expect(result[0].contestantRoundData[0].roundScore).toBe(20);
        expect(result[0].contestantRoundData[0].totalScore).toBe(20);
    });

    it("Should accumulate total score over multiple rounds and should remove at least one team per round", () => {
        // Arrange
        let exampleTeam = new Team({teamName: "name1_1 & name1_2", isParticipating: true, eliminationOrder: 0});
        let exampleTeam2 = new Team({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 0});
        let exampleTeam3 = new Team({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 0});

        const teamList = [exampleTeam, exampleTeam2, exampleTeam3];
        const rounds = 2;

        // Act
        const result = LeagueStanding.generateContestantRoundScores(teamList, rounds, "");

        // Assert
        expect(result).not.toBeNull();
        // assert 2 rounds
        expect(result.length).toBe(2);
        // round1 assertions
        expect(result[0]).not.toBeNull();
        expect(result[0].contestantRoundData).not.toBeNull();
        expect(result[0].contestantRoundData.length).toBe(1);
        expect(result[0].contestantRoundData[0].roundScore).toBe(20);
        expect(result[0].contestantRoundData[0].totalScore).toBe(20);
        // round2 assertions
        expect(result[1]).not.toBeNull();
        expect(result[1].contestantRoundData).not.toBeNull();
        expect(result[1].contestantRoundData.length).toBe(1);
        expect(result[1].contestantRoundData[0].roundScore).toBe(10);
        expect(result[1].contestantRoundData[0].totalScore).toBe(30);
    });
});

describe("addContestantRoundScores", () => {

    let exampleTeam = new Team({teamName: "name1_1 & name1_2", isParticipating: true, eliminationOrder: 0});
    let exampleTeam2 = new Team({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 0});
    let exampleTeam3 = new Team({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 0});

    it("Should add multiple contestants to one rounds contestantRoundData per time add is called", () => {
        // Arrange
        const teamList = [exampleTeam, exampleTeam2, exampleTeam3];
        const rounds = 1;
        const expectedContestantName1 = "contestant1";
        const expectedContestantName2 = "contestant2";
        const sut = new LeagueStanding();

        // Act
        sut.addContestantRoundScores(teamList, rounds, expectedContestantName1);
        sut.addContestantRoundScores(teamList, rounds, expectedContestantName2);

        // Assert
        expect(sut).not.toBeNull();
        expect(sut.rounds).not.toBeNull();
        expect(sut.rounds.length).toBe(1);
        expect(sut.rounds[0]).not.toBeNull();
        expect(sut.rounds[0].contestantRoundData).not.toBeNull();
        expect(sut.rounds[0].contestantRoundData.length).toBe(2);
        const resultingContestantRoundData =  sut.rounds[0].contestantRoundData;
        expect(resultingContestantRoundData[0].name).toBe(expectedContestantName1);
        expect(resultingContestantRoundData[1].name).toBe(expectedContestantName2);
    });

    it("Should not break if handicap is not passed", () => {
        // Arrange
        const teamList = [exampleTeam, exampleTeam2, exampleTeam3];
        const rounds = 1;
        const expectedContestantName1 = "contestant1";
        const sut = new LeagueStanding();

        // Act
        sut.addContestantRoundScores(teamList, rounds, expectedContestantName1);

        // Assert
        expect(sut).not.toBeNull();
        expect(sut.rounds).not.toBeNull();
        expect(sut.rounds.length).toBe(1);
        expect(sut.rounds[0]).not.toBeNull();
        expect(sut.rounds[0].contestantRoundData).not.toBeNull();
        expect(sut.rounds[0].contestantRoundData.length).toBe(1);
        const resultingContestantRoundData =  sut.rounds[0].contestantRoundData;
        expect(resultingContestantRoundData[0].totalScore).toBe(20);
    });

    it("Should modify totalScore if handicap is not passed", () => {
        // Arrange
        const teamList = [exampleTeam, exampleTeam2, exampleTeam3];
        const rounds = 1;
        const expectedContestantName1 = "contestant1";
        const expectedHandicap = -10;
        const sut = new LeagueStanding();

        // Act
        sut.addContestantRoundScores(teamList, rounds, expectedContestantName1, expectedHandicap);

        // Assert
        expect(sut).not.toBeNull();
        expect(sut.rounds).not.toBeNull();
        expect(sut.rounds.length).toBe(1);
        expect(sut.rounds[0]).not.toBeNull();
        expect(sut.rounds[0].contestantRoundData).not.toBeNull();
        expect(sut.rounds[0].contestantRoundData.length).toBe(1);
        const resultingContestantRoundData =  sut.rounds[0].contestantRoundData;
        expect(resultingContestantRoundData[0].totalScore).toBe(10);
    });
});

describe("Regression Tests Checking Scoring of Archived Leagues", () => {

    it("");

});
