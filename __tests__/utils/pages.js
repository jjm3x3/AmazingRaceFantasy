import * as pagesModule from "../../app/utils/pages";
import path from "path";

jest.mock("../../app/utils/pages", () => {
    return {
      ...jest.requireActual("../../app/utils/pages"),
      getConfigurationPath: jest.fn().mockImplementation(()=> path.join(process.cwd(),'__tests__','mockData','leagueConfiguration')),
      getConfigurationPage: jest.fn().mockImplementation(filename => {
        return require(`../mockData/leagueConfiguration/${filename}`);
      }),
      getDataPath: jest.fn().mockImplementation(filename => {
        return path.join(process.cwd(),'__tests__','mockData','leagueData', filename)
      })
    };
});

describe("pages getPages", () =>  {
    it("should return appropriate data based on folder structure", () => {
        const pages = pagesModule.getPages();
        expect(pages.length).toBe(2);
        expect(pages[0].name).toBe("Current (Big Brother 26)");
        expect(pages[1].name).toBe("Amazing Race 36");
    });
    it("should have subpages based on leagueConfig and leagueData", ()=> {
        const pages = pagesModule.getPages();
        const bigBrotherSubpages = pages[0].subpages;
        // Check for active leagues with no leagueData
        expect(bigBrotherSubpages.length).toBe(1);
        expect(bigBrotherSubpages[0].name).toBe("Contestants");
        expect(bigBrotherSubpages[0].path).toBe("/active/big-brother-26/contestants");
        // Check for archive leagues with leagueData
        const amazingRaceSubpages = pages[1].subpages;
        expect(amazingRaceSubpages.length).toBe(3);
        expect(amazingRaceSubpages[0].name).toBe("Contestants");
        expect(amazingRaceSubpages[0].path).toBe("/archive/amazing-race-36/contestants");
        expect(amazingRaceSubpages[1].name).toBe("Scoring");
        expect(amazingRaceSubpages[1].path).toBe("/archive/amazing-race-36/scoring");
        expect(amazingRaceSubpages[2].name).toBe("League Standing");
        expect(amazingRaceSubpages[2].path).toBe("/archive/amazing-race-36/league-standing");
    });
});
