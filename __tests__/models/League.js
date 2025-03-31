import League from "@/app/models/League";
import Team from "../../app/models/Team";

describe("generateContestantRoundScores", () => {
    it("Should work with simple defaults", () => {
        // Arrange
        const teamList  = [];
        const rounds = 0;

        // Act
        const result = League.generateContestantRoundScores(teamList, rounds, "");

        // Assert
        expect(result).not.toBeNull();
        expect(result.length).toBe(0);
    });

    it("Should work with one round", () => {
        // Arrange
        const teamList  = [];
        const rounds = 1;

        // Act
        const result = League.generateContestantRoundScores(teamList, rounds, "");

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
        const result = League.generateContestantRoundScores(teamList, rounds, "");

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
        const result = League.generateContestantRoundScores(teamList, rounds, "");

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
        const result = League.generateContestantRoundScores(teamList, rounds, "");

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
        const result = League.generateContestantRoundScores(teamList, rounds, "");

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
        const sut = new League();

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
        const sut = new League();

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
        const sut = new League();

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

describe("getNumberOfRounds", () => {
    it("should not ever return Number.MAX_VALUE", () => {
        //Arrange
        const teamList = [{eliminationOrder: 1}, {eliminationOrder:2}, {eliminationOrder: Number.MAX_VALUE}];
        const league = new League(teamList);

        // Act
        const result = league.getNumberOfRounds();

        // Assert
        expect(result).not.toBe(Number.MAX_VALUE);
    });

    it("Should return the number of unique eliminationOrders", () => {
        //Arrange
        const teamList = [
            {eliminationOrder: 1},
            {eliminationOrder: 1},
            {eliminationOrder: 3},
        ];
        const league = new League(teamList);

        // Act
        const result = league.getNumberOfRounds();

        // Assert
        expect(result).toBe(2);
    });

    it("Should not countin Number.MAX_VALUE as a unique number", () => {
        //Arrange
        const teamList = [
            {eliminationOrder: 1},
            {eliminationOrder: 3},
            {eliminationOrder: Number.MAX_VALUE}
        ];
        const league = new League(teamList);

        // Act
        const result = league.getNumberOfRounds();

        // Assert
        expect(result).toBe(2);
    });

    it("Should not countin 0 as a unique number", () => {
        //Arrange
        const teamList = [
            {eliminationOrder: 1},
            {eliminationOrder: 3},
            {eliminationOrder: 0}
        ];
        const league = new League(teamList);

        // Act
        const result = league.getNumberOfRounds();

        // Assert
        expect(result).toBe(2);
    });
});

describe("Regression Tests Checking Scoring of Archived Leagues", () => {

    it("Should Score Rachel correctly for Amazing Race 35", () => {

        // Arrange
        const rachelsRawTeamList = [{"teamName":"Todd Martin & Ashlie Martin","relationship":"Married High School Sweethearts","isParticipating":false,"eliminationOrder":9},{"teamName":"Jocelyn Chao & Victor Limary","relationship":"Married Entrepreneurs","isParticipating":false,"eliminationOrder":3},{"teamName":"Joel Strasser & Garrett Smith","relationship":"Best Friends","isParticipating":false,"eliminationOrder":12.5},{"teamName":"Morgan Franklin & Lena Franklin","relationship":"Sisters","isParticipating":false,"eliminationOrder":7},{"teamName":"Joe Moskowitz & Ian Todd","relationship":"Engaged","isParticipating":false,"eliminationOrder":4},{"teamName":"Rob McArthur & Corey McArthur","relationship":"Father & Son","isParticipating":false,"eliminationOrder":11.5},{"teamName":"Greg Franklin & John Franklin","relationship":"Brothers & Computer Scientists","isParticipating":true,"eliminationOrder":0},{"teamName":"Liam Hykel & Yeremi Hykel","relationship":"Brothers","isParticipating":false,"eliminationOrder":5},{"teamName":"Steve Cargile & Anna Leigh Wilson","relationship":"Father & Daughter","isParticipating":false,"eliminationOrder":10},{"teamName":"Andrea Simpson & Malaina Hatcher","relationship":"College Friends","isParticipating":false,"eliminationOrder":6},{"teamName":"Robbin Tomich & Chelsea Day","relationship":"Childhood Friends","isParticipating":false,"eliminationOrder":8},{"teamName":"Elizabeth Rivera & Iliana Rivera","relationship":"Mother & Daughter","isParticipating":false,"eliminationOrder":2},{"teamName":"Alexandra Lichtor & Sheridan Lichtor","relationship":"Siblings & Roommates","isParticipating":false,"eliminationOrder":1}]

        const rachelsParsedAndEmbelishedTeamList = rachelsRawTeamList.map(t => {
            return new Team(t);
        });

        const numberOfRounds = 13;
        const handicap = 0;

        // Act
        const rachelsRoundScores = League.generateContestantRoundScores(rachelsParsedAndEmbelishedTeamList, numberOfRounds, "testingRach", handicap);

        // Assert
        expect(rachelsRoundScores.length).toBe(numberOfRounds);


        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting on contestant into the league
        // round 0
        expect(rachelsRoundScores[0].round).toBe(0);
        expect(rachelsRoundScores[0].contestantRoundData[0].roundScore).toBe(120);
        expect(rachelsRoundScores[0].contestantRoundData[0].totalScore).toBe(120);

        // round 1
        expect(rachelsRoundScores[1].round).toBe(1);
        expect(rachelsRoundScores[1].contestantRoundData[0].roundScore).toBe(110);
        expect(rachelsRoundScores[1].contestantRoundData[0].totalScore).toBe(230);

        // round 2
        expect(rachelsRoundScores[2].round).toBe(2);
        expect(rachelsRoundScores[2].contestantRoundData[0].roundScore).toBe(90);
        expect(rachelsRoundScores[2].contestantRoundData[0].totalScore).toBe(320);

        // round 3
        expect(rachelsRoundScores[3].round).toBe(3);
        expect(rachelsRoundScores[3].contestantRoundData[0].roundScore).toBe(70);
        expect(rachelsRoundScores[3].contestantRoundData[0].totalScore).toBe(390);

        // round 4
        expect(rachelsRoundScores[4].round).toBe(4);
        expect(rachelsRoundScores[4].contestantRoundData[0].roundScore).toBe(50);
        expect(rachelsRoundScores[4].contestantRoundData[0].totalScore).toBe(440);

        // round 5
        expect(rachelsRoundScores[5].round).toBe(5);
        expect(rachelsRoundScores[5].contestantRoundData[0].roundScore).toBe(50);
        expect(rachelsRoundScores[5].contestantRoundData[0].totalScore).toBe(490);

        // round 6
        expect(rachelsRoundScores[6].round).toBe(6);
        expect(rachelsRoundScores[6].contestantRoundData[0].roundScore).toBe(30);
        expect(rachelsRoundScores[6].contestantRoundData[0].totalScore).toBe(520);

        // round 7
        expect(rachelsRoundScores[7].round).toBe(7);
        expect(rachelsRoundScores[7].contestantRoundData[0].roundScore).toBe(20);
        expect(rachelsRoundScores[7].contestantRoundData[0].totalScore).toBe(540);

        // round 8
        expect(rachelsRoundScores[8].round).toBe(8);
        expect(rachelsRoundScores[8].contestantRoundData[0].roundScore).toBe(10);
        expect(rachelsRoundScores[8].contestantRoundData[0].totalScore).toBe(550);

        // round 9
        expect(rachelsRoundScores[9].round).toBe(9);
        expect(rachelsRoundScores[9].contestantRoundData[0].roundScore).toBe(10);
        expect(rachelsRoundScores[9].contestantRoundData[0].totalScore).toBe(560);

        // round 10
        expect(rachelsRoundScores[10].round).toBe(10);
        expect(rachelsRoundScores[10].contestantRoundData[0].roundScore).toBe(0);
        expect(rachelsRoundScores[10].contestantRoundData[0].totalScore).toBe(560);

        // round 11
        expect(rachelsRoundScores[11].round).toBe(11);
        expect(rachelsRoundScores[11].contestantRoundData[0].roundScore).toBe(0);
        expect(rachelsRoundScores[11].contestantRoundData[0].totalScore).toBe(560);

        // round 12
        expect(rachelsRoundScores[12].round).toBe(12);
        expect(rachelsRoundScores[12].contestantRoundData[0].roundScore).toBe(0);
        expect(rachelsRoundScores[12].contestantRoundData[0].totalScore).toBe(560);
    });

    it("Should Score Anita correctly for Amazing Race 36", () => {

        // Arrange
        const anitasRawTeamList = [{"teamName":"Rod Gardner & Leticia Gardner","relationship":"Married","isParticipating":false,"eliminationOrder":11.5},{"teamName":"Ricky Rotandi & Cesar Aldrete","relationship":"Boyfriends","isParticipating":true,"eliminationOrder":0},{"teamName":"Juan Villa & Shane Bilek","relationship":"Military Pilots","isParticipating":false,"eliminationOrder":12.5},{"teamName":"Sunny Pulver & Bizzy Smith","relationship":"Firefighter Moms","isParticipating":false,"eliminationOrder":7},{"teamName":"Derek Williams & Shelisa Williams","relationship":"Grandparents","isParticipating":false,"eliminationOrder":6},{"teamName":"Michelle Clark & Sean Clark","relationship":"Married Aerobics Instructors","isParticipating":false,"eliminationOrder":4},{"teamName":"Yvonne Chavez & Melissa Main","relationship":"Girlfriends","isParticipating":false,"eliminationOrder":9},{"teamName":"Kishori Turner & Karishma Cordero","relationship":"Cousins","isParticipating":false,"eliminationOrder":5},{"teamName":"Anthony Smith & Bailey Smith","relationship":"Twins","isParticipating":false,"eliminationOrder":3},{"teamName":"Angie Butler & Danny Butler","relationship":"Mother & Son","isParticipating":false,"eliminationOrder":8},{"teamName":"Amber Craven & Vinny Cagungun","relationship":"Dating Nurses","isParticipating":false,"eliminationOrder":10},{"teamName":"Chris Foster & Mary Cardona-Foster","relationship":"Father & Daughter","isParticipating":false,"eliminationOrder":2},{"teamName":"Maya Mody & Rohan Mody","relationship":"Siblings","isParticipating":false,"eliminationOrder":1}]

        const anitasParsedAndEmbelishedTeamList = anitasRawTeamList.map(t => {
            return new Team(t);
        });

        const numberOfRounds = 13;
        const handicap = 0;

        // Act
        const anitasRoundScores = League.generateContestantRoundScores(anitasParsedAndEmbelishedTeamList, numberOfRounds, "testingAnita", handicap);

        // Assert
        expect(anitasRoundScores.length).toBe(numberOfRounds);


        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting on contestant into the league
        // round 0
        expect(anitasRoundScores[0].round).toBe(0);
        expect(anitasRoundScores[0].contestantRoundData[0].roundScore).toBe(120);
        expect(anitasRoundScores[0].contestantRoundData[0].totalScore).toBe(120);

        // round 1
        expect(anitasRoundScores[1].round).toBe(1);
        expect(anitasRoundScores[1].contestantRoundData[0].roundScore).toBe(110);
        expect(anitasRoundScores[1].contestantRoundData[0].totalScore).toBe(230);

        // round 2
        expect(anitasRoundScores[2].round).toBe(2);
        expect(anitasRoundScores[2].contestantRoundData[0].roundScore).toBe(90);
        expect(anitasRoundScores[2].contestantRoundData[0].totalScore).toBe(320);

        // round 3
        expect(anitasRoundScores[3].round).toBe(3);
        expect(anitasRoundScores[3].contestantRoundData[0].roundScore).toBe(70);
        expect(anitasRoundScores[3].contestantRoundData[0].totalScore).toBe(390);

        // round 4
        expect(anitasRoundScores[4].round).toBe(4);
        expect(anitasRoundScores[4].contestantRoundData[0].roundScore).toBe(60);
        expect(anitasRoundScores[4].contestantRoundData[0].totalScore).toBe(450);

        // round 5
        expect(anitasRoundScores[5].round).toBe(5);
        expect(anitasRoundScores[5].contestantRoundData[0].roundScore).toBe(50);
        expect(anitasRoundScores[5].contestantRoundData[0].totalScore).toBe(500);

        // round 6
        expect(anitasRoundScores[6].round).toBe(6);
        expect(anitasRoundScores[6].contestantRoundData[0].roundScore).toBe(30);
        expect(anitasRoundScores[6].contestantRoundData[0].totalScore).toBe(530);

        // round 7
        expect(anitasRoundScores[7].round).toBe(7);
        expect(anitasRoundScores[7].contestantRoundData[0].roundScore).toBe(30);
        expect(anitasRoundScores[7].contestantRoundData[0].totalScore).toBe(560);

        // round 8
        expect(anitasRoundScores[8].round).toBe(8);
        expect(anitasRoundScores[8].contestantRoundData[0].roundScore).toBe(30);
        expect(anitasRoundScores[8].contestantRoundData[0].totalScore).toBe(590);

        // round 9
        expect(anitasRoundScores[9].round).toBe(9);
        expect(anitasRoundScores[9].contestantRoundData[0].roundScore).toBe(30);
        expect(anitasRoundScores[9].contestantRoundData[0].totalScore).toBe(620);

        // round 10
        expect(anitasRoundScores[10].round).toBe(10);
        expect(anitasRoundScores[10].contestantRoundData[0].roundScore).toBe(10);
        expect(anitasRoundScores[10].contestantRoundData[0].totalScore).toBe(630);

        // round 11
        expect(anitasRoundScores[11].round).toBe(11);
        expect(anitasRoundScores[11].contestantRoundData[0].roundScore).toBe(0);
        expect(anitasRoundScores[11].contestantRoundData[0].totalScore).toBe(630);

        // round 12
        expect(anitasRoundScores[12].round).toBe(12);
        expect(anitasRoundScores[12].contestantRoundData[0].roundScore).toBe(0);
        expect(anitasRoundScores[12].contestantRoundData[0].totalScore).toBe(630);
    });

    it("Should Score Sean correctly for Big Brother 26", () => {

        // Arrange
        const seansRawTeamList = [{"teamName":"Cam Sullivan-Brown","relationship":"Physical therapist","isParticipating":false,"eliminationOrder":14},{"teamName":"Joseph Rodriguez","relationship":"Video store clerk","isParticipating":false,"eliminationOrder":7},{"teamName":"Leah Peters","relationship":"VIP cocktail server","isParticipating":false,"eliminationOrder":10},{"teamName":"Brooklyn Rivera","relationship":"Business administrator","isParticipating":false,"eliminationOrder":5},{"teamName":"Kenney Kelley","relationship":"Former undercover cop","isParticipating":false,"eliminationOrder":3},{"teamName":"T'kor Clottey","relationship":"Crochet business owner","isParticipating":false,"eliminationOrder":9},{"teamName":"Cedric Hodges","relationship":"Former marine","isParticipating":false,"eliminationOrder":4},{"teamName":"Matt Hardeman","relationship":"Tech sales rep","isParticipating":false,"eliminationOrder":1},{"teamName":"Makensy Manbeck","relationship":"Construction project manager","isParticipating":false,"eliminationOrder":15},{"teamName":"Kimo Apaka","relationship":"Mattress sales representative","isParticipating":false,"eliminationOrder":12},{"teamName":"Tucker Des Lauriers","relationship":"Marketing/sales executive","isParticipating":false,"eliminationOrder":6},{"teamName":"Quinn Martin","relationship":"Nurse recruiter","isParticipating":false,"eliminationOrder":8},{"teamName":"Angela Murray","relationship":"Real estate agent","isParticipating":false,"eliminationOrder":11},{"teamName":"Rubina Bernabe","relationship":"Event bartender","isParticipating":false,"eliminationOrder":13},{"teamName":"Lisa Weintraub","relationship":"Celebrity chef","isParticipating":false,"eliminationOrder":2},{"teamName":"Chelsie Baham","relationship":"Nonprofit director","isParticipating":true,"eliminationOrder":1.7976931348623157e+308}]


        const seansParsedAndEmbelishedTeamList = seansRawTeamList.map(t => {
            return new Team(t);
        });

        const numberOfRounds = 15;
        const handicap = 0;

        // Act
        const seansRoundScores = League.generateContestantRoundScores(seansParsedAndEmbelishedTeamList, numberOfRounds, "testingSean", handicap);

        // Assert
        expect(seansRoundScores.length).toBe(numberOfRounds);

        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting on contestant into the league
        // round 0
        expect(seansRoundScores[0].round).toBe(0);
        expect(seansRoundScores[0].contestantRoundData[0].roundScore).toBe(140);
        expect(seansRoundScores[0].contestantRoundData[0].totalScore).toBe(140);

        // round 1
        expect(seansRoundScores[1].round).toBe(1);
        expect(seansRoundScores[1].contestantRoundData[0].roundScore).toBe(130);
        expect(seansRoundScores[1].contestantRoundData[0].totalScore).toBe(270);

        // round 2
        expect(seansRoundScores[2].round).toBe(2);
        expect(seansRoundScores[2].contestantRoundData[0].roundScore).toBe(110);
        expect(seansRoundScores[2].contestantRoundData[0].totalScore).toBe(380);

        // round 3
        expect(seansRoundScores[3].round).toBe(3);
        expect(seansRoundScores[3].contestantRoundData[0].roundScore).toBe(90);
        expect(seansRoundScores[3].contestantRoundData[0].totalScore).toBe(470);

        // round 4
        expect(seansRoundScores[4].round).toBe(4);
        expect(seansRoundScores[4].contestantRoundData[0].roundScore).toBe(70);
        expect(seansRoundScores[4].contestantRoundData[0].totalScore).toBe(540);

        // round 5
        expect(seansRoundScores[5].round).toBe(5);
        expect(seansRoundScores[5].contestantRoundData[0].roundScore).toBe(60);
        expect(seansRoundScores[5].contestantRoundData[0].totalScore).toBe(600);

        // round 6
        expect(seansRoundScores[6].round).toBe(6);
        expect(seansRoundScores[6].contestantRoundData[0].roundScore).toBe(40);
        expect(seansRoundScores[6].contestantRoundData[0].totalScore).toBe(640);

        // round 7
        expect(seansRoundScores[7].round).toBe(7);
        expect(seansRoundScores[7].contestantRoundData[0].roundScore).toBe(30);
        expect(seansRoundScores[7].contestantRoundData[0].totalScore).toBe(670);

        // round 8
        expect(seansRoundScores[8].round).toBe(8);
        expect(seansRoundScores[8].contestantRoundData[0].roundScore).toBe(20);
        expect(seansRoundScores[8].contestantRoundData[0].totalScore).toBe(690);

        // round 9
        expect(seansRoundScores[9].round).toBe(9);
        expect(seansRoundScores[9].contestantRoundData[0].roundScore).toBe(10);
        expect(seansRoundScores[9].contestantRoundData[0].totalScore).toBe(700);

        // round 10
        expect(seansRoundScores[10].round).toBe(10);
        expect(seansRoundScores[10].contestantRoundData[0].roundScore).toBe(10);
        expect(seansRoundScores[10].contestantRoundData[0].totalScore).toBe(710);

        // round 11
        expect(seansRoundScores[11].round).toBe(11);
        expect(seansRoundScores[11].contestantRoundData[0].roundScore).toBe(10);
        expect(seansRoundScores[11].contestantRoundData[0].totalScore).toBe(720);

        // round 12
        expect(seansRoundScores[12].round).toBe(12);
        expect(seansRoundScores[12].contestantRoundData[0].roundScore).toBe(10);
        expect(seansRoundScores[12].contestantRoundData[0].totalScore).toBe(730);

        // round 13
        expect(seansRoundScores[13].round).toBe(13);
        expect(seansRoundScores[13].contestantRoundData[0].roundScore).toBe(0);
        expect(seansRoundScores[13].contestantRoundData[0].totalScore).toBe(730);

        // round 14
        expect(seansRoundScores[14].round).toBe(14);
        expect(seansRoundScores[14].contestantRoundData[0].roundScore).toBe(0);
        expect(seansRoundScores[14].contestantRoundData[0].totalScore).toBe(730);
    });
});
