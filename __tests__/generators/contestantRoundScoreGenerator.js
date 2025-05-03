import { generateContestantRoundScores } from "@/app/generators/contestantRoundScoreGenerator"
import parseBigBrotherEntities from "@/app/parsers/bigBrotherEntityParser";
import parseAmazingRaceEntities from "@/app/parsers/amazingRaceEntityParser";

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
});
