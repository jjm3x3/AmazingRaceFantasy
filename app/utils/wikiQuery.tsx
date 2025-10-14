import { ITableRowData } from "../dataSources/wikiFetch";

export function isPartialContestantData(contestantRowData: ITableRowData): boolean {
    // Admittedly this is probably a moving target and may come with the baggage
    // of a doubleNegative since we are often using this as a filter, The idea
    // is this should return true if we are lacking the necessary/sufficent data
    // to create a showcontestnat.
    return (contestantRowData.name == null || contestantRowData.name === "") && (!contestantRowData.name2 || !contestantRowData.col2);
}

export function stripTableHeader(competingEntityData :ITableRowData[]): ITableRowData[] {
    return competingEntityData.filter(x => {
        return !(x.name === ""
            && (x.name2.includes("\n")
                || x.name2.includes("Contestants")
                || x.name2.includes("Age")
                || x.name2.includes("Relationship")
                || x.name2.includes("Hometown")
                || x.name2.includes("Status"))
            && x.col1 === ""
            && x.col2 === ""
            && x.col3 === ""
            && x.col4 === ""
            && x.col5 === "");
    });
}

