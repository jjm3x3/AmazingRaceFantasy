import { ITableRowData } from "@/app/dataSources/wikiFetch";
import CompetingEntity from "@/app/models/CompetingEntity";
import ParserOptions from "@/app/models/ParserOptions";
import parseAmazingRaceEntities from "@/app/parsers/amazingRaceEntityParser";
import parseBigBrotherEntities from "@/app/parsers/bigBrotherEntityParser";
import parseSurvivorEntities from "@/app/parsers/survivorEntityParser";

export function parseEntities(contestantData: ITableRowData[], showName: string, parserOptions?: ParserOptions): CompetingEntity[] {

    const parserFn = getParser(showName);
    const result =  parserFn(contestantData, parserOptions);

    return result;
}

export function getParser(showName: string): (_itrd: ITableRowData[], _po?: ParserOptions) => CompetingEntity[] {

    if (showName.match("amazing_race")) {
        return parseAmazingRaceEntities;
    } else if(showName.match("big_brother")) {
        return parseBigBrotherEntities;
    } else {
        return parseSurvivorEntities;
    }
}
