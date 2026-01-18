import { generateContestantRoundScores } from "@/app/generators/contestantRoundScoreGenerator"
import parseBigBrotherEntities from "@/app/parsers/bigBrotherEntityParser";
import parseAmazingRaceEntities from "@/app/parsers/amazingRaceEntityParser";
import parseSurvivorEntities from "@/app/parsers/survivorEntityParser";

describe("Regression Tests Checking generation of Archived Leagues", () => {

    const amazingRace35WikiTableData = [{"name":"","name2":"Contestants\nAge\nRelationship\nHometown\nStatus","col1":"","col2":"","col3":"","col4":"","col5":""},{"name":"Alexandra Lichtor","name2":"Alexandra Lichtor","col1":"34","col2":"Siblings & Roommates","col3":"Chicago, Illinois","col4":"Eliminated 1st(in Mueang Nonthaburi, Thailand)","col5":""},{"name":"Sheridan Lichtor","name2":"Sheridan Lichtor","col1":"29","col2":"","col3":"","col4":"","col5":""},{"name":"Elizabeth Rivera","name2":"Elizabeth Rivera","col1":"52","col2":"Mother & Daughter","col3":"Tampa, Florida","col4":"Eliminated 2nd(in Sam Phran, Thailand)","col5":""},{"name":"Iliana Rivera","name2":"Iliana Rivera","col1":"27","col2":"","col3":"","col4":"","col5":""},{"name":"Jocelyn Chao","name2":"Jocelyn Chao","col1":"49","col2":"Married Entrepreneurs","col3":"Albuquerque, New Mexico","col4":"Eliminated 3rd(in Cần Thơ, Vietnam)","col5":""},{"name":"Victor Limary","name2":"Victor Limary","col1":"49","col2":"","col3":"","col4":"","col5":""},{"name":"Joe Moskowitz","name2":"Joe Moskowitz","col1":"35","col2":"Engaged","col3":"New York City, New York","col4":"Eliminated 4th(in Jaipur, India)","col5":""},{"name":"Ian Todd","name2":"Ian Todd","col1":"40","col2":"","col3":"","col4":"","col5":""},{"name":"Liam Hykel","name2":"Liam Hykel","col1":"23","col2":"Brothers","col3":"Cheyenne, Wyoming","col4":"Eliminated 5th(in Jaipur, India)","col5":""},{"name":"Yeremi Hykel","name2":"Yeremi Hykel","col1":"24","col2":"San Marcos, Texas","col3":"","col4":"","col5":""},{"name":"Andrea Simpson","name2":"Andrea Simpson","col1":"44","col2":"College Friends","col3":"Philadelphia, Pennsylvania","col4":"Eliminated 6th(in Cologne, Germany)","col5":""},{"name":"Malaina Hatcher","name2":"Malaina Hatcher","col1":"45","col2":"","col3":"","col4":"","col5":""},{"name":"Morgan Franklin","name2":"Morgan Franklin","col1":"31","col2":"Sisters","col3":"Brooklyn, New York","col4":"Eliminated 7th(in Ljubljana, Slovenia)","col5":""},{"name":"Lena Franklin","name2":"Lena Franklin","col1":"29","col2":"Los Angeles, California","col3":"","col4":"","col5":""},{"name":"Robbin Tomich","name2":"Robbin Tomich","col1":"41","col2":"Childhood Friends","col3":"Kirkland, Washington","col4":"Eliminated 8th(in Socerb, Slovenia)","col5":""},{"name":"Chelsea Day","name2":"Chelsea Day","col1":"41","col2":"Shoreline, Washington","col3":"","col4":"","col5":""},{"name":"Todd Martin","name2":"Todd Martin","col1":"38","col2":"Married High School Sweethearts","col3":"Chino, California","col4":"Eliminated 9th(in Stockholm, Sweden)","col5":""},{"name":"Ashlie Martin","name2":"Ashlie Martin","col1":"38","col2":"","col3":"","col4":"","col5":""},{"name":"Steve Cargile","name2":"Steve Cargile","col1":"54","col2":"Father & Daughter","col3":"Petty, Texas","col4":"Eliminated 10th(in Dublin, Ireland)","col5":""},{"name":"Anna Leigh Wilson","name2":"Anna Leigh Wilson","col1":"28","col2":"Royse City, Texas","col3":"","col4":"","col5":""},{"name":"Rob McArthur","name2":"Rob McArthur","col1":"48","col2":"Father & Son","col3":"Riverside, California","col4":"Third place","col5":""},{"name":"Corey McArthur","name2":"Corey McArthur","col1":"25","col2":"New York City, New York","col3":"","col4":"","col5":""},{"name":"Joel Strasser","name2":"Joel Strasser","col1":"42","col2":"Best Friends","col3":"Kuna, Idaho","col4":"Runners-up","col5":""},{"name":"Garrett Smith","name2":"Garrett Smith","col1":"43","col2":"Meridian, Idaho","col3":"","col4":"","col5":""},{"name":"Greg Franklin","name2":"Greg Franklin","col1":"25","col2":"Brothers & Computer Scientists","col3":"New York City, New York","col4":"Winners","col5":""},{"name":"John Franklin","name2":"John Franklin","col1":"27","col2":"Mountain View, California","col3":"","col4":"","col5":""}]

    const rachelsAmazingRace35RawTeamList = [ "Ashlie Martin & Todd Martin", "Jocelyn Chao & Victor Limary", "Garrett Smith & Joel Strasser", "Lena Franklin & Morgan Franklin", "Ian Todd & Joe Moskowitz", "Corey McArthur & Rob McArthur", "Greg Franklin & John Franklin", "Liam Hykel & Yeremi Hykel", "Anna Leigh Wilson & Steve Cargile", "Andrea Simpson & Malaina Hatcher", "Chelsea Day & Robbin Tomich", "Elizabeth Rivera & Iliana Rivera", "Alexandra Lichtor & Sheridan Lichtor" ];

    const rachelsAmazingRace35ContestantLeagueData = {
        name: "Rachel",
        userId: "E3BA8CF1-0F66-4911-88D8-A9ECFEEB37A7",
        ranking: rachelsAmazingRace35RawTeamList,
    };

    const andrewsAmazingRace35RawTeamList = [ "Corey McArthur & Rob McArthur", "Jocelyn Chao & Victor Limary", "Liam Hykel & Yeremi Hykel", "Greg Franklin & John Franklin", "Ashlie Martin & Todd Martin", "Chelsea Day & Robbin Tomich", "Lena Franklin & Morgan Franklin", "Anna Leigh Wilson & Steve Cargile", "Garrett Smith & Joel Strasser", "Ian Todd & Joe Moskowitz", "Andrea Simpson & Malaina Hatcher", "Elizabeth Rivera & Iliana Rivera", "Alexandra Lichtor & Sheridan Lichtor" ];


    const andrewsAmazingRace35ContestantLeagueData = {
        name: "Andrew",
        userId: "6252275B-C6AF-427B-82A6-1F4B4A2267C1",
        ranking: andrewsAmazingRace35RawTeamList
    };

    it("Should return a league with rachels scoring for AmazingRace_35", async () => {

        // Arrange
        const testDataFetcher = () => new Promise((resolve, _reject) => {
            resolve(amazingRace35WikiTableData);
        });
        const rachelsContestantLeagueData = rachelsAmazingRace35ContestantLeagueData
        const listOfContetantLeagueData = [rachelsContestantLeagueData]

        const expectedNumberOfRounds = 12;

        // Act
        const result = await generateContestantRoundScores(testDataFetcher, parseAmazingRaceEntities, listOfContetantLeagueData);

        // Assert
        expect(result.rounds.length).toBe(expectedNumberOfRounds);

        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting one contestant into the league
        // round 0 (only testing to make sure we start is correct)
        expect(result.rounds[0].round).toBe(0);
        expect(result.rounds[0].contestantRoundData[0].name).toBe(rachelsContestantLeagueData.name);
        expect(result.rounds[0].contestantRoundData[0].roundScore).toBe(120);
        expect(result.rounds[0].contestantRoundData[0].totalScore).toBe(120);

        //// round 1..10 not testing because we aren't using them today

        // round 11
        expect(result.rounds[11].round).toBe(11);
        expect(result.rounds[11].contestantRoundData[0].name).toBe(rachelsContestantLeagueData.name);
        expect(result.rounds[11].contestantRoundData[0].roundScore).toBe(0);
        expect(result.rounds[11].contestantRoundData[0].totalScore).toBe(560);
    });

    it("Should return a league with rachels & andrews scoring for AmazingRace_35", async () => {

        // Arrange
        const testDataFetcher = () => new Promise((resolve, _reject) => {
            resolve(amazingRace35WikiTableData);
        });
        const rachelsContestantLeagueData = rachelsAmazingRace35ContestantLeagueData
        const listOfContetantLeagueData = [rachelsContestantLeagueData, andrewsAmazingRace35ContestantLeagueData]

        const expectedNumberOfRounds = 12;

        // Act
        const result = await generateContestantRoundScores(testDataFetcher, parseAmazingRaceEntities, listOfContetantLeagueData);

        // Assert
        expect(result.rounds.length).toBe(expectedNumberOfRounds);

        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting one contestant into the league
        // round 0 (only testing to make sure we start is correct)
        expect(result.rounds[0].round).toBe(0);
        expect(result.rounds[0].contestantRoundData.length).toBe(2);
        expect(result.rounds[0].contestantRoundData[0].name).toBe(rachelsContestantLeagueData.name);
        expect(result.rounds[0].contestantRoundData[1].name).toBe(andrewsAmazingRace35ContestantLeagueData.name);

        //// round 1..10 not testing because we aren't using them today

        // round 11
        expect(result.rounds[11].round).toBe(11);
        expect(result.rounds[11].contestantRoundData.length).toBe(2);
        expect(result.rounds[11].contestantRoundData[0].name).toBe(rachelsContestantLeagueData.name);
        expect(result.rounds[11].contestantRoundData[1].name).toBe(andrewsAmazingRace35ContestantLeagueData.name);
        expect(result.rounds[11].contestantRoundData[0].totalScore).toBe(560);
        expect(result.rounds[11].contestantRoundData[1].totalScore).toBe(610);
    });

    it("Should return a league with Anitas scoring for AmazingRace_36", async () => {

        // Arrange
        const testDataFetcher = () => new Promise((resolve, _reject) => {
            resolve(
                [{"name":"","name2":"Contestants\nAge\nRelationship\nHometown\nStatus","col1":"","col2":"","col3":"","col4":"","col5":""},{"name":"Maya Mody","name2":"Maya Mody","col1":"19","col2":"Siblings","col3":"Monmouth Junction, New Jersey","col4":"Eliminated 1st(in Puerto Vallarta, Mexico)","col5":""},{"name":"Rohan Mody","name2":"Rohan Mody","col1":"22","col2":"","col3":"","col4":"","col5":""},{"name":"Chris Foster","name2":"Chris Foster","col1":"60","col2":"Father & Daughter","col3":"Waltham, Massachusetts","col4":"Eliminated 2nd(in Puerto Vallarta, Mexico)","col5":""},{"name":"Mary Cardona-Foster","name2":"Mary Cardona-Foster","col1":"27","col2":"","col3":"","col4":"","col5":""},{"name":"Anthony Smith","name2":"Anthony Smith","col1":"26","col2":"Twins","col3":"Clearwater, Florida","col4":"Eliminated 3rd(in El Peñol, Colombia)","col5":""},{"name":"Bailey Smith","name2":"Bailey Smith","col1":"26","col2":"","col3":"","col4":"","col5":""},{"name":"Michelle Clark","name2":"Michelle Clark","col1":"39","col2":"Married Aerobics Instructors","col3":"East Point, Georgia","col4":"Eliminated 4th(in Medellín, Colombia)","col5":""},{"name":"Sean Clark","name2":"Sean Clark","col1":"46","col2":"","col3":"","col4":"","col5":""},{"name":"Kishori Turner","name2":"Kishori Turner","col1":"26","col2":"Cousins","col3":"Gaithersburg, Maryland","col4":"Eliminated 5th(in Santiago, Chile)","col5":""},{"name":"Karishma Cordero","name2":"Karishma Cordero","col1":"22","col2":"Austin, Texas","col3":"","col4":"","col5":""},{"name":"Derek Williams","name2":"Derek Williams","col1":"57","col2":"Grandparents","col3":"Alta Loma, California","col4":"Eliminated 6th(in Córdoba, Argentina)","col5":""},{"name":"Shelisa Williams","name2":"Shelisa Williams","col1":"55","col2":"","col3":"","col4":"","col5":""},{"name":"Sunny Pulver","name2":"Sunny Pulver","col1":"41","col2":"Firefighter Moms","col3":"Edgerton, Wisconsin","col4":"Eliminated 7th(in Montevideo, Uruguay)","col5":""},{"name":"Bizzy Smith","name2":"Bizzy Smith","col1":"37","col2":"New Berlin, Wisconsin","col3":"","col4":"","col5":""},{"name":"Angie Butler","name2":"Angie Butler","col1":"55","col2":"Mother & Son","col3":"Walla Walla, Washington","col4":"Eliminated 8th(in Christ Church, Barbados)","col5":""},{"name":"Danny Butler","name2":"Danny Butler","col1":"27","col2":"San Diego, California","col3":"","col4":"","col5":""},{"name":"Yvonne Chavez","name2":"Yvonne Chavez","col1":"40","col2":"Girlfriends","col3":"San Diego, California","col4":"Eliminated 9th(in Puerto Plata, Dominican Republic)","col5":""},{"name":"Melissa Main","name2":"Melissa Main","col1":"38","col2":"","col3":"","col4":"","col5":""},{"name":"Amber Craven","name2":"Amber Craven","col1":"30","col2":"Dating Nurses","col3":"Englewood, Colorado","col4":"Eliminated 10th(in La Boca, Dominican Republic)","col5":""},{"name":"Vinny Cagungun","name2":"Vinny Cagungun","col1":"37","col2":"","col3":"","col4":"","col5":""},{"name":"Rod Gardner","name2":"Rod Gardner","col1":"46","col2":"Married","col3":"Lawrenceville, Georgia","col4":"Third place","col5":""},{"name":"Leticia Gardner","name2":"Leticia Gardner","col1":"38","col2":"","col3":"","col4":"","col5":""},{"name":"Juan Villa","name2":"Juan Villa","col1":"29","col2":"Military Pilots","col3":"Spokane, Washington","col4":"Runners-up","col5":""},{"name":"Shane Bilek","name2":"Shane Bilek","col1":"29","col2":"Marine City, Michigan","col3":"","col4":"","col5":""},{"name":"Ricky Rotandi","name2":"Ricky Rotandi","col1":"34","col2":"Boyfriends","col3":"New York City, New York","col4":"Winners","col5":""},{"name":"Cesar Aldrete","name2":"Cesar Aldrete","col1":"34","col2":"","col3":"","col4":"","col5":""}]
            );
        });

        const anitasRawTeamList = [ "Rod Gardner & Leticia Gardner", "Ricky Rotandi & Cesar Aldrete", "Juan Villa & Shane Bilek", "Sunny Pulver & Bizzy Smith", "Derek Williams & Shelisa Williams", "Michelle Clark & Sean Clark", "Yvonne Chavez & Melissa Main", "Kishori Turner & Karishma Cordero", "Anthony Smith & Bailey Smith", "Angie Butler & Danny Butler", "Amber Craven & Vinny Cagungun", "Chris Foster & Mary Cardona-Foster", "Maya Mody & Rohan Mody"];

        const anitasContestantLeagueData = {
            name: "Anita",
            userId: "E75E9D22-C1B5-4AF9-9824-841F15080E94",
            ranking: anitasRawTeamList
        };
        const listOfContetantLeagueData = [anitasContestantLeagueData]

        const expectedNumberOfRounds = 12;

        // Act
        const result = await generateContestantRoundScores(testDataFetcher, parseAmazingRaceEntities, listOfContetantLeagueData);

        // Assert
        expect(result.rounds.length).toBe(expectedNumberOfRounds);

        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting one contestant into the league
        // round 0 (only testing to make sure we start is correct)
        expect(result.rounds[0].round).toBe(0);
        expect(result.rounds[0].contestantRoundData[0].name).toBe(anitasContestantLeagueData.name);
        expect(result.rounds[0].contestantRoundData[0].roundScore).toBe(120);
        expect(result.rounds[0].contestantRoundData[0].totalScore).toBe(120);

        //// round 1..10 not testing because we aren't using them today

        // round 11
        expect(result.rounds[11].round).toBe(11);
        expect(result.rounds[11].contestantRoundData[0].name).toBe(anitasContestantLeagueData.name);
        expect(result.rounds[11].contestantRoundData[0].roundScore).toBe(0);
        expect(result.rounds[11].contestantRoundData[0].totalScore).toBe(630);
    });

    it("Should return a league with Seans scoring for BigBrother_26", async () => {

        // Arrange
        const testDataFetcher = () => new Promise((resolve, _reject) => {
            resolve(
                [{"name":"","name2":"Name\nAge\nOccupation\nResidence\nResult","col1":"","col2":"","col3":"","col4":"","col5":""},{"name":"Chelsie Baham","name2":"Chelsie Baham","col1":"27","col2":"Nonprofit director","col3":"Rancho Cucamonga, California","col4":"WinnerDay 90","col5":""},{"name":"Makensy Manbeck","name2":"Makensy Manbeck","col1":"22","col2":"Construction project manager","col3":"Houston, Texas","col4":"Runner-upDay 90","col5":""},{"name":"Cam Sullivan-Brown","name2":"Cam Sullivan-Brown","col1":"25","col2":"Physical therapist","col3":"Bowie, Maryland","col4":"Evicted Day 90","col5":""},{"name":"Rubina Bernabe","name2":"Rubina Bernabe","col1":"35","col2":"Event bartender","col3":"Los Angeles, California","col4":"Evicted Day 87","col5":""},{"name":"Kimo Apaka","name2":"Kimo Apaka","col1":"35","col2":"Mattress sales representative","col3":"Hilo, Hawaii","col4":"Evicted Day 80","col5":""},{"name":"Angela Murray","name2":"Angela Murray","col1":"50","col2":"Real estate agent","col3":"Syracuse, Utah","col4":"Evicted Day 73","col5":""},{"name":"Leah Peters","name2":"Leah Peters","col1":"26","col2":"VIP cocktail server","col3":"Miami, Florida","col4":"","col5":""},{"name":"T'kor Clottey","name2":"T'kor Clottey","col1":"23","col2":"Crochet business owner","col3":"Atlanta, Georgia","col4":"Evicted Day 66","col5":""},{"name":"Quinn Martin","name2":"Quinn Martin","col1":"25","col2":"Nurse recruiter","col3":"Omaha, Nebraska","col4":"Evicted Day 59","col5":""},{"name":"Joseph Rodriguez","name2":"Joseph Rodriguez","col1":"30","col2":"Video store clerk","col3":"Tampa, Florida","col4":"Evicted Day 52","col5":""},{"name":"Tucker Des Lauriers","name2":"Tucker Des Lauriers","col1":"30","col2":"Marketing/sales executive","col3":"Brooklyn, New York","col4":"Evicted Day 45","col5":""},{"name":"Brooklyn Rivera","name2":"Brooklyn Rivera","col1":"34","col2":"Business administrator","col3":"Dallas, Texas","col4":"Evicted Day 38","col5":""},{"name":"Cedric Hodges","name2":"Cedric Hodges","col1":"21","col2":"Former marine","col3":"Boise, Idaho","col4":"Evicted Day 31","col5":""},{"name":"Kenney Kelley","name2":"Kenney Kelley","col1":"52","col2":"Former undercover cop","col3":"Boston, Massachusetts","col4":"Evicted Day 24","col5":""},{"name":"Lisa Weintraub","name2":"Lisa Weintraub","col1":"33","col2":"Celebrity chef","col3":"Los Angeles, California","col4":"Evicted Day 17","col5":""},{"name":"Matt Hardeman","name2":"Matt Hardeman","col1":"25","col2":"Tech sales rep","col3":"Roswell, Georgia","col4":"Evicted Day 10","col5":""}]
            );
        });

        const seansRawTeamList = [ "Cam Sullivan-Brown", "Joseph Rodriguez", "Leah Peters", "Brooklyn Rivera", "Kenney Kelley", "T'kor Clottey", "Cedric Hodges", "Matt Hardeman", "Makensy Manbeck", "Kimo Apaka", "Tucker Des Lauriers", "Quinn Martin", "Angela Murray", "Rubina Bernabe", "Lisa Weintraub", "Chelsie Baham" ];

        const seansContestantLeagueData = {
            name: "Sean",
            userId: "EABAE0D9-0AD0-4F2F-97E3-DF22212A375F",
            ranking: seansRawTeamList
        };
        const listOfContetantLeagueData = [seansContestantLeagueData]

        const expectedNumberOfRounds = 15;

        // Act
        const result = await generateContestantRoundScores(testDataFetcher, parseBigBrotherEntities, listOfContetantLeagueData);

        // Assert
        expect(result.rounds.length).toBe(expectedNumberOfRounds);

        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting one contestant into the league
        // round 0 (only testing to make sure we start is correct)
        expect(result.rounds[0].round).toBe(0);
        expect(result.rounds[0].contestantRoundData[0].name).toBe(seansContestantLeagueData.name);
        expect(result.rounds[0].contestantRoundData[0].roundScore).toBe(140);
        expect(result.rounds[0].contestantRoundData[0].totalScore).toBe(140);

        //// round 1..13 not testing because we aren't using them today

        // round 11
        expect(result.rounds[14].round).toBe(14);
        expect(result.rounds[14].contestantRoundData[0].name).toBe(seansContestantLeagueData.name);
        expect(result.rounds[14].contestantRoundData[0].roundScore).toBe(0);
        expect(result.rounds[14].contestantRoundData[0].totalScore).toBe(730);
    });

    it("Should return a league with Antoinettes scoring for Survivor_47", async () => {

        // Arrange
        const testDataFetcher = () => new Promise((resolve, _reject) => {
            resolve(
                [ { name: "", name2: "Contestant\nAge\nFrom\nTribe\nFinish", col1: "", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "", name2: "Original\nNone\nMerged\nPlacement\nDay", col1: "", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Jon Lovett", name2: "Jon Lovett", col1: "42", col2: "Los Angeles,California", col3: "Gata", col4: "", col5: "", col6: "1st voted out", col7: "Day 3" }, { name: "TK Foster", name2: "TK Foster", col1: "31", col2: "Upper Marlboro,Maryland", col3: "Tuku", col4: "2nd voted out", col5: "Day 5", col6: "", col7: "" }, { name: "Aysha Welch", name2: "Aysha Welch", col1: "32", col2: "Houston,Texas", col3: "Lavo", col4: "3rd voted out", col5: "Day 7", col6: "", col7: "" }, { name: "Kishan Patel", name2: "Kishan Patel", col1: "28", col2: "San Francisco,California", col3: "4th voted out", col4: "Day 8", col5: "", col6: "", col7: "" }, { name: "Anika Dhar", name2: "Anika Dhar", col1: "26", col2: "Los Angeles,California", col3: "Gata", col4: "5th voted out", col5: "Day 10", col6: "", col7: "" }, { name: "Rome Cooney", name2: "Rome Cooney", col1: "30", col2: "Phoenix,Arizona", col3: "Lavo", col4: "None[a]", col5: "6th voted out", col6: "Day 12", col7: "" }, { name: "Tiyana Hallums", name2: "Tiyana Hallums", col1: "27", col2: "Aiea,Hawaii", col3: "Tuku", col4: "Beka", col5: "7th voted out", col6: "Day 13", col7: "" }, { name: "Sierra Wright", name2: "Sierra Wright", col1: "26", col2: "Phoenixville,Pennsylvania", col3: "Gata", col4: "8th voted out1st jury member", col5: "Day 15", col6: "", col7: "" }, { name: "Sol Yi", name2: "Sol Yi", col1: "43", col2: "Norwalk,Connecticut", col3: "Lavo", col4: "9th voted out2nd jury member", col5: "Day 16", col6: "", col7: "" }, { name: "Gabe Ortis", name2: "Gabe Ortis", col1: "26", col2: "Baltimore,Maryland", col3: "Tuku", col4: "10th voted out3rd jury member", col5: "Day 18", col6: "", col7: "" }, { name: "Kyle Ostwald", name2: "Kyle Ostwald", col1: "31", col2: "Cheboygan,Michigan", col3: "11th voted out4th jury member", col4: "Day 20", col5: "", col6: "", col7: "" }, { name: "Caroline Vidmar", name2: "Caroline Vidmar", col1: "27", col2: "Chicago,Illinois", col3: "12th voted out5th jury member", col4: "Day 22", col5: "", col6: "", col7: "" }, { name: "Andy Rueda", name2: "Andy Rueda", col1: "31", col2: "Brooklyn,New York", col3: "Gata", col4: "13th voted out6th jury member", col5: "Day 23", col6: "", col7: "" }, { name: "Genevieve Mushaluk", name2: "Genevieve Mushaluk", col1: "32", col2: "Winnipeg,Manitoba", col3: "Lavo", col4: "14th voted out7th jury member", col5: "Day 24", col6: "", col7: "" }, { name: "Teeny Chirichillo", name2: "Teeny Chirichillo", col1: "24", col2: "Manahawkin, New Jersey", col3: "Eliminated8th jury member", col4: "Day 25", col5: "", col6: "", col7: "" }, { name: "Sue Smey", name2: "Sue Smey", col1: "59", col2: "Putnam Valley,New York", col3: "Tuku", col4: "2nd runner-up", col5: "Day 26", col6: "", col7: "" }, { name: "Sam Phalen", name2: "Sam Phalen", col1: "24", col2: "Nashville,Tennessee", col3: "Gata", col4: "Runner-up", col5: "", col6: "", col7: "" }, { name: "Rachel LaMont", name2: "Rachel LaMont", col1: "34", col2: "Southfield,Michigan", col3: "Sole Survivor", col4: "", col5: "", col6: "", col7: "" } ]
            );
        });

        const antoinettesRawTeamList = [ "Tiyana Hallums", "Kyle Ostwald", "Sierra Wright", "Gabe Ortis", "Caroline Vidmar", "Anika Dhar", "Aysha Welch", "Sue Smey", "Rachel LaMont", "Sol Yi", "Kishan Patel", "Sam Phalen", "Teeny Chirichillo", "TK Foster", "Genevieve Mushaluk", "Andy Rueda", "Rome Cooney", "Jon Lovett" ];

        const antoinettesContestantLeagueData = {
            name: "Antoinette",
            userId: "DCC9DCDC-AE5C-4A53-AF09-23F3C957D60B",
            ranking: antoinettesRawTeamList
        };
        const listOfContetantLeagueData = [antoinettesContestantLeagueData]

        const expectedNumberOfRounds = 17;

        // Act
        const result = await generateContestantRoundScores(testDataFetcher, parseSurvivorEntities, listOfContetantLeagueData);

        // Assert
        expect(result.rounds.length).toBe(expectedNumberOfRounds);

        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting one contestant into the league
        // round 0 (only testing to make sure we start is correct)
        expect(result.rounds[0].round).toBe(0);
        expect(result.rounds[0].contestantRoundData[0].name).toBe(antoinettesContestantLeagueData.name);
        expect(result.rounds[0].contestantRoundData[0].roundScore).toBe(170);
        expect(result.rounds[0].contestantRoundData[0].totalScore).toBe(170);

        //// round 1..13 not testing because we aren't using them today

        // round 11
        expect(result.rounds[14].round).toBe(14);
        expect(result.rounds[14].contestantRoundData[0].name).toBe(antoinettesContestantLeagueData.name);
        expect(result.rounds[14].contestantRoundData[0].roundScore).toBe(0);
        expect(result.rounds[14].contestantRoundData[0].totalScore).toBe(970);
    });

    it("Should return a league with Andrews scoring for AmazingRace_37", async () => {

        // Arrange
        const testDataFetcher = () => new Promise((resolve, _reject) => {
            resolve(
                [ { name: "", name2: "Contestants\nAge\nRelationship\nHometown\nStatus", col1: "", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Jackye Clayton", name2: "Jackye Clayton", col1: "51", col2: "Sisters", col3: "Waco, Texas", col4: "Eliminated 1st & 2nd(in Hong Kong)", col5: "", col6: "", col7: "" }, { name: "Lauren McKinney", name2: "Lauren McKinney", col1: "61", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Mark Crawford", name2: "Mark Crawford", col1: "63", col2: "Retired Firefighters", col3: "Watertown, Tennessee", col4: "", col5: "", col6: "", col7: "" }, { name: "Larry Graham", name2: "Larry Graham", col1: "59", col2: "Bartlett, Tennessee", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Ernest Cato", name2: "Ernest Cato", col1: "59", col2: "Father & Daughter", col3: "Chicago, Illinois", col4: "Eliminated 3rd(in Minoh, Japan)", col5: "", col6: "", col7: "" }, { name: "Bridget Cato", name2: "Bridget Cato", col1: "28", col2: "Somerville, Massachusetts", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Courtney Ramsey", name2: "Courtney Ramsey", col1: "33", col2: "Dating Nurses", col3: "Leland, North Carolina", col4: "Eliminated 4th(in Kyoto, Japan)", col5: "", col6: "", col7: "" }, { name: "Jasmin Carey", name2: "Jasmin Carey", col1: "34", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Bernie Gutierrez", name2: "Bernie Gutierrez", col1: "31", col2: "Friends", col3: "Dallas, Texas", col4: "Eliminated 5th(in Kubu, Indonesia)", col5: "", col6: "", col7: "" }, { name: "Carrigain Scadden", name2: "Carrigain Scadden", col1: "33", col2: "Denver, Colorado", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Scott Thompson", name2: "Scott Thompson", col1: "47", col2: "Married Parents of Eight", col3: "Salt Lake City, Utah", col4: "Eliminated 6th (in Nusa Dua, Indonesia)", col5: "", col6: "", col7: "" }, { name: "Lori Thompson", name2: "Lori Thompson", col1: "49", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Jeff \"Pops\" Bailey", name2: "Jeff \"Pops\" Bailey", col1: "65", col2: "Father & Son Lumberjacks", col3: "St. Louis, Missouri", col4: "Eliminated 7th (in Dubai, United Arab Emirates)", col5: "", col6: "", col7: "" }, { name: "Jeff Bailey", name2: "Jeff Bailey", col1: "36", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Nick Fiorito", name2: "Nick Fiorito", col1: "32", col2: "Brothers", col3: "Brooklyn, New York", col4: "Eliminated 8th (in Sarantsi, Bulgaria)", col5: "", col6: "", col7: "" }, { name: "Mike Fiorito", name2: "Mike Fiorito", col1: "28", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Melinda Papadeas", name2: "Melinda Papadeas", col1: "66", col2: "Mother & Daughter", col3: "Chandler, Arizona", col4: "Eliminated 9th (in Sofia, Bulgaria)", col5: "", col6: "", col7: "" }, { name: "Erika Papadeas", name2: "Erika Papadeas", col1: "32", col2: "Englewood, Colorado", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Brett Hamby", name2: "Brett Hamby", col1: "36", col2: "Married Vegas Performers", col3: "Las Vegas, Nevada", col4: "Eliminated 10th (in Scherwiller, France)", col5: "", col6: "", col7: "" }, { name: "Mark Romain", name2: "Mark Romain", col1: "37", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Alyssa Borden", name2: "Alyssa Borden", col1: "31", col2: "Married Nurses", col3: "Philadelphia, Pennsylvania", col4: "Eliminated 11th  (in Vila Nova de Gaia, Portugal)", col5: "", col6: "", col7: "" }, { name: "Josiah Borden", name2: "Josiah Borden", col1: "32", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Jonathan Towns", name2: "Jonathan Towns", col1: "42", col2: "Married Parents", col3: "Pomona, California", col4: "Third place", col5: "", col6: "", col7: "" }, { name: "Ana Towns", name2: "Ana Towns", col1: "35", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Han Nguyen", name2: "Han Nguyen", col1: "26", col2: "Siblings", col3: "Los Gatos, California", col4: "Runners-up", col5: "", col6: "", col7: "" }, { name: "Holden Nguyen", name2: "Holden Nguyen", col1: "22", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Carson McCalley", name2: "Carson McCalley", col1: "28", col2: "Best Friends & Gamers", col3: "Brooklyn, New York", col4: "Winners", col5: "", col6: "", col7: "" }, { name: "Jack Dodge", name2: "Jack Dodge", col1: "27", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" } ]
            );
        });

        const andrewsRawTeamList = [ "Brett Hamby & Mark Romain", "Nick Fiorito & Mike Fiorito", "Courtney Ramsey & Jasmin Carey", "Alyssa Borden & Josiah Borden", "Jonathan Towns & Ana Towns", "Bernie Gutierrez & Carrigain Scadden", "Jeff \"Pops\" Bailey & Jeff Bailey", "Carson McCalley & Jack Dodge", "Scott Thompson & Lori Thompson", "Han Nguyen & Holden Nguyen", "Ernest Cato & Bridget Cato", "Melinda Papadeas & Erika Papadeas", "Mark Crawford & Larry Graham", "Jackye Clayton & Lauren McKinney" ];

        const andrewsContestantLeagueData = {
            name: "Andrew J.",
            userId: "6252275B-C6AF-427B-82A6-1F4B4A2267C1",
            ranking: andrewsRawTeamList
        };
        const listOfContetantLeagueData = [andrewsContestantLeagueData]

        const expectedNumberOfRounds = 12;

        // Act
        const result = await generateContestantRoundScores(testDataFetcher, parseAmazingRaceEntities, listOfContetantLeagueData);

        // Assert
        expect(result.rounds.length).toBe(expectedNumberOfRounds);

        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting one contestant into the league
        // round 0 (only testing to make sure we start is correct)
        expect(result.rounds[0].round).toBe(0);
        expect(result.rounds[0].contestantRoundData[0].name).toBe(andrewsContestantLeagueData.name);
        expect(result.rounds[0].contestantRoundData[0].roundScore).toBe(120);
        expect(result.rounds[0].contestantRoundData[0].totalScore).toBe(120);

        //// round 1..10 not testing because we aren't using them today

        result.rounds.forEach(r => {
            console.log(`Round ${r.round}: has score: ${r.contestantRoundData[0].totalScore} adding ${r.contestantRoundData[0].roundScore}`);
        });

        // round 11
        expect(result.rounds[11].round).toBe(11);
        expect(result.rounds[11].contestantRoundData[0].name).toBe(andrewsContestantLeagueData.name);
        expect(result.rounds[11].contestantRoundData[0].roundScore).toBe(0);
        expect(result.rounds[11].contestantRoundData[0].totalScore).toBe(550);
    });

    it("Should return a league with Seans scoring for BigBrother_27", async () => {

        // Arrange
        const testDataFetcher = () => new Promise((resolve, _reject) => {
            resolve(
                [ { name: "", name2: "Name\nAge\nOccupation\nResidence\nResult", col1: "", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Ashley Hollis", name2: "Ashley Hollis", col1: "25", col2: "Attorney", col3: "New York City, New York", col4: "WinnerDay 83", col5: "", col6: "", col7: "" }, { name: "Vince Panaro", name2: "Vince Panaro", col1: "34", col2: "Unemployed", col3: "West Hills, California", col4: "Runner-upDay 83", col5: "", col6: "", col7: "" }, { name: "Morgan Pope", name2: "Morgan Pope", col1: "33", col2: "Gamer", col3: "Los Angeles, California", col4: "Evicted Day 83", col5: "", col6: "", col7: "" }, { name: "Ava Pearl", name2: "Ava Pearl", col1: "24", col2: "Aura painter", col3: "New York City, New York", col4: "Evicted Day 80", col5: "", col6: "", col7: "" }, { name: "Keanu Soto", name2: "Keanu Soto", col1: "33", col2: "Dungeon master", col3: "McKinney, Texas", col4: "Evicted Day 77", col5: "", col6: "", col7: "" }, { name: "Lauren Domingue", name2: "Lauren Domingue", col1: "22", col2: "Bridal stylist", col3: "Lafayette, Louisiana", col4: "Evicted Day 73", col5: "", col6: "", col7: "" }, { name: "Kelley Jorgensen", name2: "Kelley Jorgensen", col1: "29", col2: "Web designer", col3: "Burbank, South Dakota", col4: "", col5: "", col6: "", col7: "" }, { name: "Cliffton \"Will\" Williams", name2: "Cliffton \"Will\" Williams", col1: "50", col2: "College sports podcaster", col3: "Charlotte, North Carolina", col4: "Evicted Day 66", col5: "", col6: "", col7: "" }, { name: "Rachel Reilly", name2: "Rachel Reilly Big Brother 12 &  Big Brother 13", col1: "40", col2: "TV personality", col3: "Hoover, Alabama", col4: "EliminatedDay 60", col5: "", col6: "", col7: "" }, { name: "Mickey Lee", name2: "Mickey Lee", col1: "35", col2: "Event curator", col3: "Atlanta, Georgia", col4: "Evicted Day 59", col5: "", col6: "", col7: "" }, { name: "Katherine Woodman", name2: "Katherine Woodman", col1: "23", col2: "Fine dining server", col3: "Columbia, South Carolina", col4: "Evicted Day 52", col5: "", col6: "", col7: "" }, { name: "Rylie Jeffries", name2: "Rylie Jeffries", col1: "27", col2: "Professional bull rider", col3: "Luther, Oklahoma", col4: "Evicted Day 45", col5: "", col6: "", col7: "" }, { name: "Zach Cornell", name2: "Zach Cornell", col1: "27", col2: "Marketing manager", col3: "Cartersville, Georgia", col4: "Evicted Day 38", col5: "", col6: "", col7: "" }, { name: "Jimmy Heagerty", name2: "Jimmy Heagerty", col1: "25", col2: "Strategy consultant", col3: "Washington, D.C.", col4: "Evicted Day 31", col5: "", col6: "", col7: "" }, { name: "Adrian Rocha", name2: "Adrian Rocha", col1: "23", col2: "Carpenter", col3: "San Antonio, Texas", col4: "Evicted Day 24", col5: "", col6: "", col7: "" }, { name: "Amy Bingham", name2: "Amy Bingham[a]", col1: "43", col2: "Insurance agent", col3: "Stockton, California", col4: "Evicted Day 17", col5: "", col6: "", col7: "" }, { name: "Isaiah \"Zae\" Frederich", name2: "Isaiah \"Zae\" Frederich", col1: "23", col2: "Salesperson", col3: "Phoenix, Arizona", col4: "Evicted Day 10", col5: "", col6: "", col7: "" } ]
            );
        });

        const seansRawTeamList = [ "Morgan Pope", "Katherine Woodman", "Kelley Jorgensen", "Zach Cornell", "Keanu Soto", "Lauren Domingue", "Rylie Jeffries", "Rachel Reilly", "Ava Pearl", "Mickey Lee", "Jimmy Heagerty", "Cliffton \"Will\" Williams", "Vince Panaro", "Isaiah \"Zae\" Frederich", "Adrian Rocha", "Ashley Hollis", "Amy Bingham" ];

        const seansContestantLeagueData = {
            name: "Sean",
            userId: "EABAE0D9-0AD0-4F2F-97E3-DF22212A375F",
            ranking: seansRawTeamList
        };
        const listOfContetantLeagueData = [seansContestantLeagueData]

        const expectedNumberOfRounds = 16;

        // Act
        const result = await generateContestantRoundScores(testDataFetcher, parseBigBrotherEntities, listOfContetantLeagueData);

        // Assert
        expect(result.rounds.length).toBe(expectedNumberOfRounds);

        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting one contestant into the league
        // round 0 (only testing to make sure we start is correct)
        expect(result.rounds[0].round).toBe(0);
        expect(result.rounds[0].contestantRoundData[0].name).toBe(seansContestantLeagueData.name);
        expect(result.rounds[0].contestantRoundData[0].roundScore).toBe(150);
        expect(result.rounds[0].contestantRoundData[0].totalScore).toBe(150);

        //// round 1..10 not testing because we aren't using them today

        result.rounds.forEach(r => {
            console.log(`Round ${r.round}: has score: ${r.contestantRoundData[0].totalScore} adding ${r.contestantRoundData[0].roundScore}`);
        });

        // round 11
        expect(result.rounds[15].round).toBe(15);
        expect(result.rounds[15].contestantRoundData[0].name).toBe(seansContestantLeagueData.name);
        expect(result.rounds[15].contestantRoundData[0].roundScore).toBe(0);
        expect(result.rounds[15].contestantRoundData[0].totalScore).toBe(1000);
    });

    it("Should return a league with Rach scoring for AmazingRace_38", async () => {

        // Arrange
        const testDataFetcher = () => new Promise((resolve, _reject) => {
            resolve(
                [ { name: "", name2: "Contestants\nAge\nRelationship\nHometown\nStatus", col1: "", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Giacomo \"Jack\" Palumbo", name2: "Giacomo \"Jack\" Palumbo", col1: "40", col2: "Jersey Brothers", col3: "Marlton, New Jersey", col4: "Eliminated 1st(in Amsterdam, Netherlands)", col5: "", col6: "", col7: "" }, { name: "Vincenzo \"Enzo\" Palumbo", name2: "Vincenzo \"Enzo\" PalumboBig Brother 12& Big Brother 22", col1: "47", col2: "Bayonne, New Jersey", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Angela Murray", name2: "Angela MurrayBig Brother 26", col1: "51", col2: "Mother & Daughter", col3: "Syracuse, Utah", col4: "Eliminated 2nd(in Prague, Czech Republic)", col5: "", col6: "", col7: "" }, { name: "Lexi Murray", name2: "Lexi Murray", col1: "23", col2: "Las Vegas, Nevada", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Megan Belmonte", name2: "Megan Belmonte", col1: "24", col2: "Newlyweds", col3: "Providence, Rhode Island", col4: "Eliminated 3rd(in Nové Dvory, Czech Republic)", col5: "", col6: "", col7: "" }, { name: "Matt Turner", name2: "Matt TurnerBig Brother 24", col1: "25", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Kathryn \"Kat\" Dunn", name2: "Kathryn \"Kat\" DunnBig Brother 21", col1: "35", col2: "Dating", col3: "Dallas, Texas", col4: "Eliminated 4th(in Budapest, Hungary)", col5: "", col6: "", col7: "" }, { name: "Alex Romo", name2: "Alex Romo", col1: "32", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Hannah Chaddha", name2: "Hannah ChaddhaBig Brother 23", col1: "25", col2: "Sisters", col3: "Washington, D.C.", col4: "Eliminated 5th(in Dubrovnik, Croatia)", col5: "", col6: "", col7: "" }, { name: "Simone Chaddha", name2: "Simone Chaddha", col1: "22", col2: "Los Angeles, California", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Kristine Bernabe", name2: "Kristine Bernabe", col1: "38", col2: "Sisters", col3: "Los Angeles, California", col4: "Eliminated 6th(in Prapratno, Croatia)", col5: "", col6: "", col7: "" }, { name: "Rubina Bernabe", name2: "Rubina BernabeBig Brother 26", col1: "36", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Natalie Negrotti", name2: "Natalie NegrottiBig Brother 18", col1: "34", col2: "Sisters", col3: "New York City, New York", col4: "Eliminated 7th(in Bucharest, Romania)", col5: "", col6: "", col7: "" }, { name: "Stephanie Negrotti", name2: "Stephanie Negrotti", col1: "36", col2: "Kauai, Hawaii", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Tucker Des Lauriers", name2: "Tucker Des LauriersBig Brother 26", col1: "31", col2: "Brothers", col3: "Brooklyn, New York", col4: "Eliminated 8th(in Athens, Greece)", col5: "", col6: "", col7: "" }, { name: "Eric Des Lauriers", name2: "Eric Des Lauriers", col1: "32", col2: "Boston, Massachusetts", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Jack Baham", name2: "Jack Baham", col1: "58", col2: "Father & Daughter", col3: "Rancho Cucamonga, California", col4: "Eliminated 9th(in Corbetta, Italy)", col5: "", col6: "", col7: "" }, { name: "Chelsie Baham", name2: "Chelsie BahamBig Brother 26", col1: "28", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Isabel \"Izzy\" Gleicher", name2: "Isabel \"Izzy\" GleicherBig Brother 25", col1: "34", col2: "Engaged", col3: "New York City, New York", col4: "Eliminated 10th(in Paris, France)", col5: "", col6: "", col7: "" }, { name: "Paige Seber", name2: "Paige Seber", col1: "32", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Joseph Abdin", name2: "Joseph AbdinBig Brother 24", col1: "28", col2: "Brothers", col3: "Palm Beach, Florida", col4: "Third place", col5: "", col6: "", col7: "" }, { name: "Adam Abdin", name2: "Adam Abdin", col1: "24", col2: "Miami, Florida", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Kyland Young", name2: "Kyland YoungBig Brother 23", col1: "34", col2: "Dating", col3: "Los Angeles, California", col4: "Runners-up", col5: "", col6: "", col7: "" }, { name: "Taylor Hale", name2: "Taylor HaleBig Brother 24& Big Brother Reindeer Games", col1: "30", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Jas Bains", name2: "Jas Bains", col1: "28", col2: "Brothers & Entrepreneurs", col3: "Omak, Washington", col4: "Winners", col5: "", col6: "", col7: "" }, { name: "Jag Bains", name2: "Jag BainsBig Brother 25", col1: "27", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" } ]
            );
        });

        const rachsRawTeamList = [ "Isabel \"Izzy\" Gleicher & Paige Seber", "Jas Bains & Jag Bains", "Natalie Negrotti & Stephanie Negrotti", "Tucker Des Lauriers & Eric Des Lauriers", "Kyland Young & Taylor Hale", "Joseph Abdin & Adam Abdin", "Hannah Chaddha & Simone Chaddha", "Kristine Bernabe & Rubina Bernabe", "Kathryn \"Kat\" Dunn & Alex Romo", "Jack Baham & Chelsie Baham", "Angela Murray & Lexi Murray", "Megan Belmonte & Matt Turner", "Giacomo \"Jack\" Palumbo & Vincenzo \"Enzo\" Palumbo" ]


        const rachsContestantLeagueData = {
            name: "Rach",
            userId: "E3BA8CF1-0F66-4911-88D8-A9ECFEEB37A7",
            ranking: rachsRawTeamList
        };
        const listOfContetantLeagueData = [rachsContestantLeagueData]

        const expectedNumberOfRounds = 12;

        // Act
        const result = await generateContestantRoundScores(testDataFetcher, parseAmazingRaceEntities, listOfContetantLeagueData);

        // Assert
        expect(result.rounds.length).toBe(expectedNumberOfRounds);

        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting one contestant into the league
        // round 0 (only testing to make sure we start is correct)
        expect(result.rounds[0].round).toBe(0);
        expect(result.rounds[0].contestantRoundData[0].name).toBe(rachsContestantLeagueData.name);
        expect(result.rounds[0].contestantRoundData[0].roundScore).toBe(120);
        expect(result.rounds[0].contestantRoundData[0].totalScore).toBe(120);

        //// round 1..10 not testing because we aren't using them today

        result.rounds.forEach(r => {
            console.log(`Round ${r.round}: has score: ${r.contestantRoundData[0].totalScore} adding ${r.contestantRoundData[0].roundScore}`);
        });

        // round 11
        expect(result.rounds[11].round).toBe(11);
        expect(result.rounds[11].contestantRoundData[0].name).toBe(rachsContestantLeagueData.name);
        expect(result.rounds[11].contestantRoundData[0].roundScore).toBe(0);
        expect(result.rounds[11].contestantRoundData[0].totalScore).toBe(650);
    });

    it("Should return a league with Antoinettes scoring for Survivor_49", async () => {

        // Arrange
        const testDataFetcher = () => new Promise((resolve, _reject) => {
            resolve(
                [ { name: "", name2: "Contestant\nAge\nFrom\nTribe\nFinish", col1: "", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "", name2: "Original\nFirstswitch\nSecondswitch\nMerged\nPlacement\nDay", col1: "", col2: "", col3: "", col4: "", col5: "", col6: "", col7: "" }, { name: "Nicole Mazullo", name2: "Nicole Mazullo", col1: "26", col2: "Philadelphia,Pennsylvania", col3: "Kele", col4: "", col5: "", col6: "", col7: "1st voted out" }, { name: "Kimberly \"Annie\" Davis", name2: "Kimberly \"Annie\" Davis", col1: "49", col2: "Austin,Texas", col3: "2nd voted out", col4: "Day 5", col5: "", col6: "", col7: "" }, { name: "Jake Latimer", name2: "Jake Latimer", col1: "35", col2: "St. Albert,Alberta", col3: "Medically evacuated", col4: "Day 6", col5: "", col6: "", col7: "" }, { name: "Jeremiah Ing", name2: "Jeremiah Ing", col1: "38", col2: "Toronto,Ontario", col3: "3rd voted out", col4: "", col5: "", col6: "", col7: "" }, { name: "Matt Williams", name2: "Matt Williams", col1: "52", col2: "St. George,Utah", col3: "Hina", col4: "Hina", col5: "4th voted out", col6: "Day 8", col7: "" }, { name: "Jason Treul", name2: "Jason Treul", col1: "32", col2: "Santa Ana,California", col3: "5th voted out", col4: "Day 10", col5: "", col6: "", col7: "" }, { name: "Shannon Fairweather", name2: "Shannon Fairweather", col1: "27", col2: "Boston,Massachusetts", col3: "Uli", col4: "Kele", col5: "Kele", col6: "6th voted out", col7: "Day 12" }, { name: "Nate Moore", name2: "Nate Moore", col1: "47", col2: "Hermosa Beach,California", col3: "Hina", col4: "Uli", col5: "Lewatu", col6: "7th voted out1st jury member", col7: "Day 14" }, { name: "Michelle \"MC\" Chukwujekwu", name2: "Michelle \"MC\" Chukwujekwu", col1: "29", col2: "San Diego,California", col3: "Hina", col4: "Kele", col5: "Hina", col6: "8th voted out2nd jury member", col7: "Day 15" }, { name: "Alex Moore", name2: "Alex Moore", col1: "26", col2: "Washington,D.C.", col3: "Kele", col4: "Uli", col5: "9th voted out3rd jury member", col6: "Day 17", col7: "" }, { name: "Jawan Pitts", name2: "Jawan Pitts", col1: "28", col2: "Los Angeles,California", col3: "Uli", col4: "Hina", col5: "Kele", col6: "10th voted out4th jury member", col7: "Day 19" }, { name: "Sophie Segreti", name2: "Sophie Segreti", col1: "31", col2: "New York City,New York", col3: "Hina", col4: "Kele", col5: "Uli", col6: "11th voted out5th jury member", col7: "Day 21" }, { name: "Steven Ramm", name2: "Steven Ramm", col1: "35", col2: "Denver,Colorado", col3: "Kele", col4: "12th voted out6th jury member", col5: "Day 23", col6: "", col7: "" }, { name: "Kristina Mills", name2: "Kristina Mills", col1: "35", col2: "Edmond,Oklahoma", col3: "Uli", col4: "13th voted out7th jury member", col5: "Day 24", col6: "", col7: "" }, { name: "Rizo Velovic", name2: "Rizo Velovic", col1: "25", col2: "Yonkers,New York", col3: "Uli", col4: "Hina", col5: "Hina", col6: "Eliminated8th jury member", col7: "Day 25" }, { name: "Sage Ahrens-Nichols", name2: "Sage Ahrens-Nichols", col1: "30", col2: "Olympia,Washington", col3: "Kele", col4: "Kele", col5: "2nd runner-up", col6: "Day 26", col7: "" }, { name: "Sophi Balerdi", name2: "Sophi Balerdi", col1: "27", col2: "Miami,Florida", col3: "Kele", col4: "Hina", col5: "Hina", col6: "Runner-up", col7: "" }, { name: "Savannah Louie", name2: "Savannah Louie", col1: "31", col2: "Atlanta,Georgia", col3: "Uli", col4: "Sole Survivor", col5: "", col6: "", col7: "" } ]
            );
        });

        const antoinettesRawTeamList = [ "Jeremiah Ing", "Savannah Louie", "Jason Treul", "Rizo Velovic", "Sage Ahrens-Nichols", "Sophi Balerdi", "Steven Ramm", "Michelle \"MC\" Chukwujekwu", "Shannon Fairweather", "Matt Williams", "Jawan Pitts", "Kristina Mills", "Sophie Segreti", "Kimberly \"Annie\" Davis", "Jake Latimer", "Nate Moore", "Alex Moore", "Nicole Mazullo"];

        const antoinettesContestantLeagueData = {
            name: "Antoinette",
            userId: "DCC9DCDC-AE5C-4A53-AF09-23F3C957D60B",
            ranking: antoinettesRawTeamList
        };
        const listOfContetantLeagueData = [antoinettesContestantLeagueData]

        const expectedNumberOfRounds = 17;

        // Act
        const result = await generateContestantRoundScores(testDataFetcher, parseSurvivorEntities, listOfContetantLeagueData);

        // Assert
        expect(result.rounds.length).toBe(expectedNumberOfRounds);

        // Note: we are always pulling the 0th contestantRoundData because we
        // are only inserting one contestant into the league
        // round 0 (only testing to make sure we start is correct)
        expect(result.rounds[0].round).toBe(0);
        expect(result.rounds[0].contestantRoundData[0].name).toBe(antoinettesContestantLeagueData.name);
        expect(result.rounds[0].contestantRoundData[0].roundScore).toBe(170);
        expect(result.rounds[0].contestantRoundData[0].totalScore).toBe(170);

        //// round 1..13 not testing because we aren't using them today

        // round 16
        expect(result.rounds[16].round).toBe(16);
        expect(result.rounds[16].contestantRoundData[0].name).toBe(antoinettesContestantLeagueData.name);
        expect(result.rounds[16].contestantRoundData[0].roundScore).toBe(0);
        expect(result.rounds[16].contestantRoundData[0].totalScore).toBe(1160);
    });
});
