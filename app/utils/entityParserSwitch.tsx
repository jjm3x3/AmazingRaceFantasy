import { ITableRowData } from "@/app/dataSources/wikiFetch";
import CompetingEntity from "@/app/models/CompetingEntity";
import parseAmazingRaceEntities from "@/app/parsers/amazingRaceEntityParser";
import parseBigBrotherEntities from "@/app/parsers/bigBrotherEntityParser";
import parseSurvivorEntities from "@/app/parsers/survivorEntityParser";

export function parseEntities(contestantData: ITableRowData[], showName: string ): CompetingEntity[] {

    const parserFn = getParser(showName);
    const result =  parserFn(contestantData);

    return result;
}

export function getParser(showName: string): (_itrd: ITableRowData[]) => CompetingEntity[] {

    if (showName.match("amazing_race")) {
        return parseAmazingRaceEntities;
    } else if(showName.match("big_brother")) {
        return parseBigBrotherEntities;
    } else {
        return parseSurvivorEntities;
    }
}
