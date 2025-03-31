import * as pagesModule from "../../app/utils/pages";

const AmazingRaceConfigData = () => {
    return { 
        wikiPageUrl: "https://en.wikipedia.org/wiki/The_Amazing_Race_36", 
        wikiApiUrl: "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=The_Amazing_Race_36",
        googleSheetUrl: "https://docs.google.com/spreadsheets/d/1AhDphP_QPb8fRYJarcgl_0o4r6yabrX_WW76XCqvvXg/edit?usp=sharing",
        leagueStatus: "archive",
        castPhrase: "Cast",
        preGoogleSheetsLinkText: "This season's contestant data has been sourced from",
        postGoogleSheetsLinkText: "which was populated using a google form.",
        competitingEntityName: "teams",
        contestantLeagueDataKeyPrefix: "amazing_race:36:*"
    };
};

const BigBrotherConfigData = () => {
    return { 
        wikiPageUrl: "https://en.wikipedia.org/wiki/Big_Brother_26_(American_season)", 
        wikiApiUrl: "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Big_Brother_26_(American_season)",
        googleSheetUrl: "https://docs.google.com/spreadsheets/d/1i-81N_JnqRl7jAHUANS5fr2tuY7CH9KpUvgTNzSIqNw/edit?usp=sharing",
        leagueStatus: "active",
        castPhrase: "Houseguests",
        preGoogleSheetsLinkText: "This season's contestant data has been sourced from",
        postGoogleSheetsLinkText: "which was populated using a google form.",
        competitingEntityName: "house guests",
        contestantLeagueDataKeyPrefix: "big_brother:26:*"
    };
};

const AmazingRaceLeagueData = ()=> {
    // Contestant Ranking
    const CONTESTANT_LEAGUE_DATA = [
        {
            name: "Andrew",
            userId: "6252275B-C6AF-427B-82A6-1F4B4A2267C1",
            ranking: [ "Juan Villa & Shane Bilek", "Rod Gardner & Leticia Gardner", "Amber Craven & Vinny Cagungun", "Ricky Rotandi & Cesar Aldrete", "Yvonne Chavez & Melissa Main", "Michelle Clark & Sean Clark", "Derek Williams & Shelisa Williams", "Anthony Smith & Bailey Smith", "Sunny Pulver & Bizzy Smith", "Angie Butler & Danny Butler", "Chris Foster & Mary Cardona-Foster", "Kishori Turner & Karishma Cordero", "Maya Mody & Rohan Mody" ]
        },
        {
            name: "Anita",
            userId: "E75E9D22-C1B5-4AF9-9824-841F15080E94",
            ranking: [ "Rod Gardner & Leticia Gardner", "Ricky Rotandi & Cesar Aldrete", "Juan Villa & Shane Bilek", "Sunny Pulver & Bizzy Smith", "Derek Williams & Shelisa Williams", "Michelle Clark & Sean Clark", "Yvonne Chavez & Melissa Main", "Kishori Turner & Karishma Cordero", "Anthony Smith & Bailey Smith", "Angie Butler & Danny Butler", "Amber Craven & Vinny Cagungun", "Chris Foster & Mary Cardona-Foster", "Maya Mody & Rohan Mody"]
        },
        {
            name: "Antoinette",
            userId: "DCC9DCDC-AE5C-4A53-AF09-23F3C957D60B",
            ranking: [ "Rod Gardner & Leticia Gardner", "Ricky Rotandi & Cesar Aldrete", "Derek Williams & Shelisa Williams", "Kishori Turner & Karishma Cordero", "Anthony Smith & Bailey Smith", "Yvonne Chavez & Melissa Main", "Sunny Pulver & Bizzy Smith", "Michelle Clark & Sean Clark", "Juan Villa & Shane Bilek", "Angie Butler & Danny Butler", "Amber Craven & Vinny Cagungun", "Chris Foster & Mary Cardona-Foster", "Maya Mody & Rohan Mody"]
        },
        {
            name: "Cindy",
            userId: "685AAAF4-97DB-4266-A0B7-E61E2C6CA22E",
            ranking: [ "Juan Villa & Shane Bilek", "Ricky Rotandi & Cesar Aldrete", "Rod Gardner & Leticia Gardner", "Derek Williams & Shelisa Williams", "Kishori Turner & Karishma Cordero", "Yvonne Chavez & Melissa Main", "Michelle Clark & Sean Clark", "Sunny Pulver & Bizzy Smith", "Amber Craven & Vinny Cagungun", "Anthony Smith & Bailey Smith", "Angie Butler & Danny Butler", "Chris Foster & Mary Cardona-Foster", "Maya Mody & Rohan Mody"]
        },
        {
            name: "Jacob",
            userId: "C7D10281-8879-4F41-929B-723EFBE4A1C4",
            ranking: [ "Rod Gardner & Leticia Gardner", "Derek Williams & Shelisa Williams", "Ricky Rotandi & Cesar Aldrete", "Anthony Smith & Bailey Smith", "Juan Villa & Shane Bilek", "Kishori Turner & Karishma Cordero", "Angie Butler & Danny Butler", "Michelle Clark & Sean Clark", "Yvonne Chavez & Melissa Main", "Amber Craven & Vinny Cagungun", "Sunny Pulver & Bizzy Smith", "Chris Foster & Mary Cardona-Foster", "Maya Mody & Rohan Mody"]
        },
        {
            name: "Jim",
            userId: "CAFA7731-EC3C-4B9D-8BC6-A199B6FB86A4",
            ranking: [ "Ricky Rotandi & Cesar Aldrete", "Derek Williams & Shelisa Williams", "Rod Gardner & Leticia Gardner", "Michelle Clark & Sean Clark", "Juan Villa & Shane Bilek", "Chris Foster & Mary Cardona-Foster", "Sunny Pulver & Bizzy Smith", "Kishori Turner & Karishma Cordero", "Anthony Smith & Bailey Smith", "Yvonne Chavez & Melissa Main", "Amber Craven & Vinny Cagungun", "Angie Butler & Danny Butler", "Maya Mody & Rohan Mody" ]
        },
        {
            name: "Rachel",
            userId: "E3BA8CF1-0F66-4911-88D8-A9ECFEEB37A7",
            ranking: ["Yvonne Chavez & Melissa Main", "Amber Craven & Vinny Cagungun", "Derek Williams & Shelisa Williams", "Ricky Rotandi & Cesar Aldrete", "Michelle Clark & Sean Clark", "Juan Villa & Shane Bilek", "Kishori Turner & Karishma Cordero", "Rod Gardner & Leticia Gardner", "Anthony Smith & Bailey Smith", "Sunny Pulver & Bizzy Smith", "Angie Butler & Danny Butler", "Chris Foster & Mary Cardona-Foster", "Maya Mody & Rohan Mody"]
        },
        {
            name: "Sam",
            userId: "CD9F9A71-FF9C-416A-8D0D-C268A13B021F",
            ranking: ["Ricky Rotandi & Cesar Aldrete", "Rod Gardner & Leticia Gardner", "Yvonne Chavez & Melissa Main", "Derek Williams & Shelisa Williams", "Juan Villa & Shane Bilek", "Sunny Pulver & Bizzy Smith", "Amber Craven & Vinny Cagungun", "Angie Butler & Danny Butler", "Kishori Turner & Karishma Cordero", "Anthony Smith & Bailey Smith", "Michelle Clark & Sean Clark", "Chris Foster & Mary Cardona-Foster", "Maya Mody & Rohan Mody"],
            handicap: -80
        }
    ];
    return CONTESTANT_LEAGUE_DATA;
};

const dataObject = {
    BigBrother_26: {leagueConfig: BigBrotherConfigData()},
    AmazingRace_36: {leagueConfig: AmazingRaceConfigData(), leagueData: AmazingRaceLeagueData()}
};

jest.mock("../../app/dataSources/dbFetch", ()=> {
    return {
        ...jest.requireActual("../../app/dataSources/dbFetch"),
        hasContestantData: jest.fn().mockImplementation((keyPrefix) => {
            const dataObjKeyArr = keyPrefix.replace(":*", "").split(":");
            const formattedShowName = dataObjKeyArr[0].split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");
            const showSeason = dataObjKeyArr[1];
            const dataObjKey =`${formattedShowName}_${showSeason}`;
            return dataObject[dataObjKey].leagueData ? true : false;
        }),
        getLeagueConfigurationKeys: jest.fn().mockImplementation(()=> {
            const ARLeagueConfigKey = `league_configuration:${dataObject.AmazingRace_36.leagueConfig.leagueStatus}:amazing_race:36`;
            const BBLeagueConfigKey = `league_configuration:${dataObject.BigBrother_26.leagueConfig.leagueStatus}:big_brother:26`;
            return [ARLeagueConfigKey, BBLeagueConfigKey];
        }),
        getLeagueConfigurationData: jest.fn().mockImplementation(filename => {
            return dataObject[filename].leagueConfig;
        })
    };
});

describe("pages getPages", () =>  {
    it("should return appropriate data order based on league status", async () => {
        const pages = await pagesModule.getPages();
        expect(pages.length).toBe(2);
        expect(pages[0].name).toBe("Current (Big Brother 26)");
        expect(pages[1].name).toBe("Amazing Race 36");
    });
    
    it("should have subpages based on leagueConfig", async ()=> {
        const pages = await pagesModule.getPages();
        const bigBrotherSubpages = pages[0].subpages;
        // Check for leagues based on leagueConfig
        expect(bigBrotherSubpages.length).toBe(1);
        expect(bigBrotherSubpages[0].name).toBe("Contestants");
        expect(bigBrotherSubpages[0].path).toBe("/active/big-brother-26/contestants");
        const amazingRaceSubpages = pages[1].subpages;
        expect(amazingRaceSubpages.length).toBe(3);
        expect(amazingRaceSubpages[0].name).toBe("Contestants");
        expect(amazingRaceSubpages[0].path).toBe("/archive/amazing-race-36/contestants");
    });

    it("should have subpages based on leagueData", async ()=> {
        const pages = await pagesModule.getPages();
        // Check for leagues based on leagueData
        const amazingRaceSubpages = pages[1].subpages;
        expect(amazingRaceSubpages[1].name).toBe("Scoring");
        expect(amazingRaceSubpages[1].path).toBe("/archive/amazing-race-36/scoring");
        expect(amazingRaceSubpages[2].name).toBe("League Standing");
        expect(amazingRaceSubpages[2].path).toBe("/archive/amazing-race-36/league-standing");
    });
});

describe("pages getUrlParams", () => {
    it("should get the url params as an object", () => {
        const { leagueStatus: ARLeagueStatus } = AmazingRaceConfigData();
        const { leagueStatus: BBLeagueStatus } = BigBrotherConfigData(); 
        const dataKeys = [`league_configuration:${ARLeagueStatus}:amazing_race:36`, `league_configuration:${BBLeagueStatus}:big_brother:26`];
        const params = pagesModule.getUrlParams(dataKeys);
        const ARParams = params[0];
        const BBParams = params[1];
        expect(params.length).toBe(2);
        expect(ARParams.showNameAndSeason).toBe("amazing-race-36");
        expect(ARParams.showStatus).toBe(ARLeagueStatus);
        expect(BBParams.showNameAndSeason).toBe("big-brother-26");
        expect(BBParams.showStatus).toBe(BBLeagueStatus);
        const ARTestUrl = new URL(`https://test.com/${ARLeagueStatus}/${ARParams.showNameAndSeason}/subpage`);
        expect(ARTestUrl).toBeTruthy();
        const BBTestUrl = new URL(`https://test.com/${BBLeagueStatus}/${BBParams.showNameAndSeason}/subpage`);
        expect(BBTestUrl).toBeTruthy();
    });
});
