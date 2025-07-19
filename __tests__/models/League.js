import League from "@/app/models/League";
import CompetingEntity from "@/app/models/CompetingEntity";

describe("generateContestantRoundScores", () => {
    it("Should work with simple defaults", () => {
        // Arrange
        const teamList  = [];
        const sut = new League(teamList);

        // Act
        const result = sut.generateContestantRoundScores(teamList, "");

        // Assert
        expect(result).not.toBeNull();
        expect(result.length).toBe(0);
    });

    it("Should throw an error when asking for more rounds then there are teams in the list", () => {
        // Arrange
        const teamList  = [{teamName: "some team name"}];
        const contestantTeamList = []
        const sut = new League(teamList);

        // Act
        const resultFunc = () => sut.generateContestantRoundScores(contestantTeamList, "");

        // Assert
        expect(resultFunc).toThrow("more rounds");
    });

    it("Should work with one round and one team in the ranking", () => {
        // Arrange
        const teamList = [new CompetingEntity({teamName: "name1_1 & name1_2"})];
        const sut = new League(teamList)

        // Act
        const result = sut.generateContestantRoundScores(teamList, "");

        // Assert
        expect(result).not.toBeNull();
        expect(result.length).toBe(1);
        expect(result[0].contestantRoundData).not.toBeNull();
        expect(result[0].contestantRoundData.length).toBe(1);
    });

    it("Should output some score when there is one", () => {
        // Arrange
        let exampleTeam = new CompetingEntity({teamName: "name1_1 & name1_2", isParticipating: true, eliminationOrder: 0});
        let exampleTeam2 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 1});

        const teamList = [exampleTeam, exampleTeam2];
        const sut = new League(teamList);

        // Act
        const result = sut.generateContestantRoundScores(teamList, "");

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
        let exampleTeam = new CompetingEntity({teamName: "name1_1 & name1_2", isParticipating: true, eliminationOrder: 0});
        let exampleTeam2 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 0});
        let exampleTeam3 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 1});

        const teamList = [exampleTeam, exampleTeam2, exampleTeam3];
        const sut = new League(teamList);

        // Act
        const result = sut.generateContestantRoundScores(teamList, "");

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
        let exampleTeam = new CompetingEntity({teamName: "name1_1 & name1_2", isParticipating: true, eliminationOrder: 0});
        let exampleTeam2 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 2});
        let exampleTeam3 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 1});

        const teamList = [exampleTeam, exampleTeam2, exampleTeam3];
        const sut = new League(teamList);

        // Act
        const result = sut.generateContestantRoundScores(teamList, "");

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

    let exampleTeam = new CompetingEntity({teamName: "name1_1 & name1_2", isParticipating: true, eliminationOrder: 0});
    let exampleTeam2 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 0});
    let exampleTeam3 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 1});

    it("Should add multiple contestants to one rounds contestantRoundData per time add is called", () => {
        // Arrange
        const teamList = [exampleTeam, exampleTeam2, exampleTeam3];
        const expectedContestantName1 = "contestant1";
        const expectedContestantName2 = "contestant2";
        const sut = new League(teamList);

        // Act
        sut.addContestantRoundScores(teamList, expectedContestantName1);
        sut.addContestantRoundScores(teamList, expectedContestantName2);

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
        const expectedContestantName1 = "contestant1";
        const sut = new League(teamList);

        // Act
        sut.addContestantRoundScores(teamList, expectedContestantName1);

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
        const expectedContestantName1 = "contestant1";
        const expectedHandicap = -10;
        const sut = new League(teamList);

        // Act
        sut.addContestantRoundScores(teamList, expectedContestantName1, expectedHandicap);

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

    let exampleTeam0 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 0});
    let exampleTeam1 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: false, eliminationOrder: 1});
    let exampleTeam2 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: false, eliminationOrder: 2});
    let exampleTeam3 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: false, eliminationOrder: 3});
    let exampleTeamMax = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: Number.MAX_VALUE});

    it("should not ever return Number.MAX_VALUE", () => {
        //Arrange
        const teamList = [exampleTeam1, exampleTeam2, exampleTeamMax];
        const league = new League(teamList);

        // Act
        const result = league.getNumberOfRounds();

        // Assert
        expect(result).not.toBe(Number.MAX_VALUE);
    });

    it("Should return the number of unique eliminationOrders", () => {
        //Arrange
        const teamList = [
            exampleTeam1,
            exampleTeam1,
            exampleTeam3,
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
            exampleTeam1,
            exampleTeam3,
            exampleTeamMax
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
            exampleTeam1,
            exampleTeam3,
            exampleTeam0
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
            return new CompetingEntity(t);
        });

        const expectedNumberOfRounds = 12;
        const handicap = 0;
        const sut = new League(rachelsParsedAndEmbelishedTeamList);

        // Act
        const rachelsRoundScores = sut.generateContestantRoundScores(rachelsParsedAndEmbelishedTeamList, "testingRach", handicap);

        // Assert
        expect(rachelsRoundScores.length).toBe(expectedNumberOfRounds);


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
    });

    it("Should Score Anita correctly for Amazing Race 36", () => {

        // Arrange
        const anitasRawTeamList = [{"teamName":"Rod Gardner & Leticia Gardner","relationship":"Married","isParticipating":false,"eliminationOrder":11.5},{"teamName":"Ricky Rotandi & Cesar Aldrete","relationship":"Boyfriends","isParticipating":true,"eliminationOrder":0},{"teamName":"Juan Villa & Shane Bilek","relationship":"Military Pilots","isParticipating":false,"eliminationOrder":12.5},{"teamName":"Sunny Pulver & Bizzy Smith","relationship":"Firefighter Moms","isParticipating":false,"eliminationOrder":7},{"teamName":"Derek Williams & Shelisa Williams","relationship":"Grandparents","isParticipating":false,"eliminationOrder":6},{"teamName":"Michelle Clark & Sean Clark","relationship":"Married Aerobics Instructors","isParticipating":false,"eliminationOrder":4},{"teamName":"Yvonne Chavez & Melissa Main","relationship":"Girlfriends","isParticipating":false,"eliminationOrder":9},{"teamName":"Kishori Turner & Karishma Cordero","relationship":"Cousins","isParticipating":false,"eliminationOrder":5},{"teamName":"Anthony Smith & Bailey Smith","relationship":"Twins","isParticipating":false,"eliminationOrder":3},{"teamName":"Angie Butler & Danny Butler","relationship":"Mother & Son","isParticipating":false,"eliminationOrder":8},{"teamName":"Amber Craven & Vinny Cagungun","relationship":"Dating Nurses","isParticipating":false,"eliminationOrder":10},{"teamName":"Chris Foster & Mary Cardona-Foster","relationship":"Father & Daughter","isParticipating":false,"eliminationOrder":2},{"teamName":"Maya Mody & Rohan Mody","relationship":"Siblings","isParticipating":false,"eliminationOrder":1}]

        const anitasParsedAndEmbelishedTeamList = anitasRawTeamList.map(t => {
            return new CompetingEntity(t);
        });

        const expectedNumberOfRounds = 12;
        const handicap = 0;
        const sut = new League(anitasParsedAndEmbelishedTeamList);

        // Act
        const anitasRoundScores = sut.generateContestantRoundScores(anitasParsedAndEmbelishedTeamList, "testingAnita", handicap);

        // Assert
        expect(anitasRoundScores.length).toBe(expectedNumberOfRounds);


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
    });

    it("Should Score Sean correctly for Big Brother 26", () => {

        // Arrange
        const seansRawTeamList = [{"teamName":"Cam Sullivan-Brown","relationship":"Physical therapist","isParticipating":false,"eliminationOrder":14},{"teamName":"Joseph Rodriguez","relationship":"Video store clerk","isParticipating":false,"eliminationOrder":7},{"teamName":"Leah Peters","relationship":"VIP cocktail server","isParticipating":false,"eliminationOrder":10},{"teamName":"Brooklyn Rivera","relationship":"Business administrator","isParticipating":false,"eliminationOrder":5},{"teamName":"Kenney Kelley","relationship":"Former undercover cop","isParticipating":false,"eliminationOrder":3},{"teamName":"T'kor Clottey","relationship":"Crochet business owner","isParticipating":false,"eliminationOrder":9},{"teamName":"Cedric Hodges","relationship":"Former marine","isParticipating":false,"eliminationOrder":4},{"teamName":"Matt Hardeman","relationship":"Tech sales rep","isParticipating":false,"eliminationOrder":1},{"teamName":"Makensy Manbeck","relationship":"Construction project manager","isParticipating":false,"eliminationOrder":15},{"teamName":"Kimo Apaka","relationship":"Mattress sales representative","isParticipating":false,"eliminationOrder":12},{"teamName":"Tucker Des Lauriers","relationship":"Marketing/sales executive","isParticipating":false,"eliminationOrder":6},{"teamName":"Quinn Martin","relationship":"Nurse recruiter","isParticipating":false,"eliminationOrder":8},{"teamName":"Angela Murray","relationship":"Real estate agent","isParticipating":false,"eliminationOrder":11},{"teamName":"Rubina Bernabe","relationship":"Event bartender","isParticipating":false,"eliminationOrder":13},{"teamName":"Lisa Weintraub","relationship":"Celebrity chef","isParticipating":false,"eliminationOrder":2},{"teamName":"Chelsie Baham","relationship":"Nonprofit director","isParticipating":true,"eliminationOrder":1.7976931348623157e+308}]


        const seansParsedAndEmbelishedTeamList = seansRawTeamList.map(t => {
            return new CompetingEntity(t);
        });

        const expectedNumberOfRounds = 15;
        const handicap = 0;
        const sut = new League(seansParsedAndEmbelishedTeamList);

        // Act
        const seansRoundScores = sut.generateContestantRoundScores(seansParsedAndEmbelishedTeamList, "testingSean", handicap);

        // Assert
        expect(seansRoundScores.length).toBe(expectedNumberOfRounds);

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

    it("Should Score Antoinette correctly for Survivor 47", () => {

        // Arrange
        const antoinettesRawTeamList = [ { teamName: "Tiyana Hallums", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 7 }, { teamName: "Kyle Ostwald", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 11 }, { teamName: "Sierra Wright", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 8 }, { teamName: "Gabe Ortis", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 10 }, { teamName: "Caroline Vidmar", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 12 }, { teamName: "Anika Dhar", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 5 }, { teamName: "Aysha Welch", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 3 }, { teamName: "Sue Smey", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 16 }, { teamName: "Rachel LaMont", relationship: "needed for ITeam", isParticipating: true, eliminationOrder: 1.7976931348623157e+308 }, { teamName: "Sol Yi", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 9 }, { teamName: "Kishan Patel", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 4 }, { teamName: "Sam Phalen", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 17 }, { teamName: "Teeny Chirichillo", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 15 }, { teamName: "TK Foster", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 2 }, { teamName: "Genevieve Mushaluk", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 14 }, { teamName: "Andy Rueda", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 13 }, { teamName: "Rome Cooney", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 6 }, { teamName: "Jon Lovett", relationship: "needed for ITeam", isParticipating: false, eliminationOrder: 1 } ];

        const antoinettesParsedAndEmbelishedTeamList = antoinettesRawTeamList.map(t => {
            return new CompetingEntity(t);
        });

        const expectedNumberOfRounds = 17;
        const handicap = 0;
        const sut = new League(antoinettesParsedAndEmbelishedTeamList);

        // Act
        const antoinettesRoundScores = sut.generateContestantRoundScores(antoinettesParsedAndEmbelishedTeamList, "testingAntoinette", handicap);

        // Assert
        expect(antoinettesRoundScores.length).toBe(expectedNumberOfRounds);

        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting on contestant into the league
        // round 0
        expect(antoinettesRoundScores[0].round).toBe(0);
        expect(antoinettesRoundScores[0].contestantRoundData[0].roundScore).toBe(170);
        expect(antoinettesRoundScores[0].contestantRoundData[0].totalScore).toBe(170);

        // round 1
        expect(antoinettesRoundScores[1].round).toBe(1);
        expect(antoinettesRoundScores[1].contestantRoundData[0].roundScore).toBe(150);
        expect(antoinettesRoundScores[1].contestantRoundData[0].totalScore).toBe(320);

        // round 2
        expect(antoinettesRoundScores[2].round).toBe(2);
        expect(antoinettesRoundScores[2].contestantRoundData[0].roundScore).toBe(130);
        expect(antoinettesRoundScores[2].contestantRoundData[0].totalScore).toBe(450);

        // round 3
        expect(antoinettesRoundScores[3].round).toBe(3);
        expect(antoinettesRoundScores[3].contestantRoundData[0].roundScore).toBe(110);
        expect(antoinettesRoundScores[3].contestantRoundData[0].totalScore).toBe(560);

        // round 4
        expect(antoinettesRoundScores[4].round).toBe(4);
        expect(antoinettesRoundScores[4].contestantRoundData[0].roundScore).toBe(100);
        expect(antoinettesRoundScores[4].contestantRoundData[0].totalScore).toBe(660);

        // round 5
        expect(antoinettesRoundScores[5].round).toBe(5);
        expect(antoinettesRoundScores[5].contestantRoundData[0].roundScore).toBe(90);
        expect(antoinettesRoundScores[5].contestantRoundData[0].totalScore).toBe(750);

        // round 6
        expect(antoinettesRoundScores[6].round).toBe(6);
        expect(antoinettesRoundScores[6].contestantRoundData[0].roundScore).toBe(70);
        expect(antoinettesRoundScores[6].contestantRoundData[0].totalScore).toBe(820);

        // round 7
        expect(antoinettesRoundScores[7].round).toBe(7);
        expect(antoinettesRoundScores[7].contestantRoundData[0].roundScore).toBe(60);
        expect(antoinettesRoundScores[7].contestantRoundData[0].totalScore).toBe(880);

        // round 8
        expect(antoinettesRoundScores[8].round).toBe(8);
        expect(antoinettesRoundScores[8].contestantRoundData[0].roundScore).toBe(50);
        expect(antoinettesRoundScores[8].contestantRoundData[0].totalScore).toBe(930);

        // round 9
        expect(antoinettesRoundScores[9].round).toBe(9);
        expect(antoinettesRoundScores[9].contestantRoundData[0].roundScore).toBe(30);
        expect(antoinettesRoundScores[9].contestantRoundData[0].totalScore).toBe(960);

        // round 10
        expect(antoinettesRoundScores[10].round).toBe(10);
        expect(antoinettesRoundScores[10].contestantRoundData[0].roundScore).toBe(10);
        expect(antoinettesRoundScores[10].contestantRoundData[0].totalScore).toBe(970);

        // round 11
        expect(antoinettesRoundScores[11].round).toBe(11);
        expect(antoinettesRoundScores[11].contestantRoundData[0].roundScore).toBe(0);
        expect(antoinettesRoundScores[11].contestantRoundData[0].totalScore).toBe(970);

        // round 12
        expect(antoinettesRoundScores[12].round).toBe(12);
        expect(antoinettesRoundScores[12].contestantRoundData[0].roundScore).toBe(0);
        expect(antoinettesRoundScores[12].contestantRoundData[0].totalScore).toBe(970);

        // round 13
        expect(antoinettesRoundScores[13].round).toBe(13);
        expect(antoinettesRoundScores[13].contestantRoundData[0].roundScore).toBe(0);
        expect(antoinettesRoundScores[13].contestantRoundData[0].totalScore).toBe(970);

        // round 14
        expect(antoinettesRoundScores[14].round).toBe(14);
        expect(antoinettesRoundScores[14].contestantRoundData[0].roundScore).toBe(0);
        expect(antoinettesRoundScores[14].contestantRoundData[0].totalScore).toBe(970);

        // round 15
        expect(antoinettesRoundScores[15].round).toBe(15);
        expect(antoinettesRoundScores[15].contestantRoundData[0].roundScore).toBe(0);
        expect(antoinettesRoundScores[15].contestantRoundData[0].totalScore).toBe(970);

        // round 16
        expect(antoinettesRoundScores[16].round).toBe(16);
        expect(antoinettesRoundScores[16].contestantRoundData[0].roundScore).toBe(0);
        expect(antoinettesRoundScores[16].contestantRoundData[0].totalScore).toBe(970);
    });

    it("Should Score Rach correctly for Amazing Race 37", () => {

        // Arrange
        const rachsRawTeamList = [ { teamName: "Jonathan Towns & Ana Towns", relationship: "Married Parents", isParticipating: false, eliminationOrder: 12 }, { teamName: "Carson McCalley & Jack Dodge", relationship: "Best Friends & Gamers", isParticipating: true, eliminationOrder: 1.7976931348623157e+308 }, { teamName: "Han Nguyen & Holden Nguyen", relationship: "Siblings", isParticipating: false, eliminationOrder: 13 }, { teamName: "Brett Hamby & Mark Romain", relationship: "Married Vegas Performers", isParticipating: false, eliminationOrder: 10 }, { teamName: "Alyssa Borden & Josiah Borden", relationship: "Married Nurses", isParticipating: false, eliminationOrder: 11 }, { teamName: "Jeff \"Pops\" Bailey & Jeff Bailey", relationship: "Father & Son Lumberjacks", isParticipating: false, eliminationOrder: 7 }, { teamName: "Melinda Papadeas & Erika Papadeas", relationship: "Mother & Daughter", isParticipating: false, eliminationOrder: 9 }, { teamName: "Nick Fiorito & Mike Fiorito", relationship: "Brothers", isParticipating: false, eliminationOrder: 8 }, { teamName: "Courtney Ramsey & Jasmin Carey", relationship: "Dating Nurses", isParticipating: false, eliminationOrder: 4 }, { teamName: "Scott Thompson & Lori Thompson", relationship: "Married Parents of Eight", isParticipating: false, eliminationOrder: 6 }, { teamName: "Bernie Gutierrez & Carrigain Scadden", relationship: "Friends", isParticipating: false, eliminationOrder: 5 }, { teamName: "Ernest Cato & Bridget Cato", relationship: "Father & Daughter", isParticipating: false, eliminationOrder: 3 }, { teamName: "Mark Crawford & Larry Graham", relationship: "Retired Firefighters", isParticipating: false, eliminationOrder: 1 }, { teamName: "Jackye Clayton & Lauren McKinney", relationship: "Sisters", isParticipating: false, eliminationOrder: 1 } ]

        const rachsParsedAndEmbelishedTeamList = rachsRawTeamList.map(t => {
            return new CompetingEntity(t);
        });

        const expectedNumberOfRounds = 12;
        const handicap = 0;
        const sut = new League(rachsParsedAndEmbelishedTeamList);

        // Act
        const rachsRoundScores = sut.generateContestantRoundScores(rachsParsedAndEmbelishedTeamList, "testingRach", handicap);

        // Assert
        expect(rachsRoundScores.length).toBe(expectedNumberOfRounds);


        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting on contestant into the league
        // round 0
        expect(rachsRoundScores[0].round).toBe(0);
        expect(rachsRoundScores[0].contestantRoundData[0].roundScore).toBe(120);
        expect(rachsRoundScores[0].contestantRoundData[0].totalScore).toBe(120);

        // round 1
        expect(rachsRoundScores[1].round).toBe(1);
        expect(rachsRoundScores[1].contestantRoundData[0].roundScore).toBe(110);
        expect(rachsRoundScores[1].contestantRoundData[0].totalScore).toBe(230);

        // round 2
        expect(rachsRoundScores[2].round).toBe(2);
        expect(rachsRoundScores[2].contestantRoundData[0].roundScore).toBe(90);
        expect(rachsRoundScores[2].contestantRoundData[0].totalScore).toBe(320);

        // round 3
        expect(rachsRoundScores[3].round).toBe(3);
        expect(rachsRoundScores[3].contestantRoundData[0].roundScore).toBe(80);
        expect(rachsRoundScores[3].contestantRoundData[0].totalScore).toBe(400);

        // round 4
        expect(rachsRoundScores[4].round).toBe(4);
        expect(rachsRoundScores[4].contestantRoundData[0].roundScore).toBe(80);
        expect(rachsRoundScores[4].contestantRoundData[0].totalScore).toBe(480);

        // round 5
        expect(rachsRoundScores[5].round).toBe(5);
        expect(rachsRoundScores[5].contestantRoundData[0].roundScore).toBe(60);
        expect(rachsRoundScores[5].contestantRoundData[0].totalScore).toBe(540);

        // round 6
        expect(rachsRoundScores[6].round).toBe(6);
        expect(rachsRoundScores[6].contestantRoundData[0].roundScore).toBe(50);
        expect(rachsRoundScores[6].contestantRoundData[0].totalScore).toBe(590);

        // round 7
        expect(rachsRoundScores[7].round).toBe(7);
        expect(rachsRoundScores[7].contestantRoundData[0].roundScore).toBe(50);
        expect(rachsRoundScores[7].contestantRoundData[0].totalScore).toBe(640);

        // round 8
        expect(rachsRoundScores[8].round).toBe(8);
        expect(rachsRoundScores[8].contestantRoundData[0].roundScore).toBe(30);
        expect(rachsRoundScores[8].contestantRoundData[0].totalScore).toBe(670);

        // round 9
        expect(rachsRoundScores[9].round).toBe(9);
        expect(rachsRoundScores[9].contestantRoundData[0].roundScore).toBe(30);
        expect(rachsRoundScores[9].contestantRoundData[0].totalScore).toBe(700);

        // round 10
        expect(rachsRoundScores[10].round).toBe(10);
        expect(rachsRoundScores[10].contestantRoundData[0].roundScore).toBe(10);
        expect(rachsRoundScores[10].contestantRoundData[0].totalScore).toBe(710);

        // round 11
        expect(rachsRoundScores[11].round).toBe(11);
        expect(rachsRoundScores[11].contestantRoundData[0].roundScore).toBe(0);
        expect(rachsRoundScores[11].contestantRoundData[0].totalScore).toBe(710);
    });
});
