import { ITableRowData } from "@/app/dataSources/wikiFetch";
import CompetingEntity from "@/app/models/CompetingEntity";
import { isPartialContestantData } from "@/app/utils/wikiQuery";

interface SurvivorFinish {
    name: string
    placement?: string
    day?: number
    isEmptyRow: boolean
}

interface RankedSurvivor {
    name: string
    isParticipating: boolean
    finishKey: number
}

// col1 and col2 are age and hometown, tribe and finish cells come after
const FINISH_COLUMNS: (keyof ITableRowData)[] = ["col3", "col4", "col5", "col6", "col7", "col8"];

const PLACEMENT_VOCABULARY = [
    "voted out",
    "eliminated",
    "medically evacuated",
    "quit",
    "removed",
    "runner-up",
    "sole survivor"
].map(removeWhitespaceAndToLower);

const DAY_PATTERN = /^Day\s*(\d+)$/;
const ORDINAL_PLACEMENT_PATTERN = /^(\d+)(?:st|nd|rd|th)(?:&\d+(?:st|nd|rd|th))?votedout/;

export default function parseSurvivorEntities(contestantData: ITableRowData[]): CompetingEntity[] {

    const finishes = contestantData
        .filter((element) => !isPartialContestantData(element))
        .map(extractFinish);

    fillSharedCells(finishes);

    const rankedSurvivors = applyDayOverrides(rankFinishes(finishes));

    return assignEliminationOrder(rankedSurvivors);
}

function extractFinish(row: ITableRowData): SurvivorFinish {
    const name = row.name || row.name2;

    const cells = FINISH_COLUMNS.map((column) => (row[column] ?? "").trim());
    let rightMostIndex = cells.length - 1;
    while (rightMostIndex >= 0 && cells[rightMostIndex] === "") {
        rightMostIndex--;
    }

    if (rightMostIndex < 0) {
        // empty row, every cell is shared with the row above
        return { name, isEmptyRow: true };
    }

    const rightMostCell = cells[rightMostIndex];
    const dayMatches = rightMostCell.match(DAY_PATTERN);
    if (dayMatches) {
        const day = Number(dayMatches[1]);
        const leftCell = rightMostIndex > 0 ? cells[rightMostIndex - 1] : "";
        if (isRecognizedPlacement(leftCell)) {
            return { name, placement: leftCell, day, isEmptyRow: false };
        }
        console.warn(`Survivor contestant '${name}' has a 'Day ${day}' cell without a recognized placement to its left: '${leftCell}'`);
        return { name, day, isEmptyRow: false };
    }

    if (isRecognizedPlacement(rightMostCell)) {
        return { name, placement: rightMostCell, isEmptyRow: false };
    }

    // typically a tribe name, the contestant is still in play
    return { name, isEmptyRow: false };
}

function fillSharedCells(finishes: SurvivorFinish[]): void {
    let lastDay: number | undefined = undefined;

    finishes.forEach((finish, index) => {
        if (finish.isEmptyRow) {
            const rowAbove = finishes[index - 1];
            if (rowAbove?.placement !== undefined) {
                finish.placement = rowAbove.placement;
                finish.day = rowAbove.day;
            } else {
                console.warn(`Survivor contestant '${finish.name}' has an empty row with no placement above it to share`);
            }
        }

        if (finish.placement !== undefined && finish.day === undefined) {
            finish.day = lastDay;
        }

        if (finish.day !== undefined) {
            lastDay = finish.day;
        }
    });
}

function rankFinishes(finishes: SurvivorFinish[]): RankedSurvivor[] {
    let previousKey = 0;

    return finishes.map((finish) => {
        const placement = finish.placement;
        if (placement === undefined) {
            return { name: finish.name, isParticipating: true, finishKey: 0 };
        }

        const compactPlacement = removeWhitespaceAndToLower(placement);
        if (compactPlacement.includes(removeWhitespaceAndToLower("sole survivor"))) {
            return { name: finish.name, isParticipating: true, finishKey: 0 };
        }

        const ordinalMatches = compactPlacement.match(ORDINAL_PLACEMENT_PATTERN);
        const finishKey = ordinalMatches ? Number(ordinalMatches[1]) : previousKey + 0.5;
        previousKey = finishKey;

        return { name: finish.name, isParticipating: false, finishKey };
    });
}

// Placeholder: show/season keyed overrides that use `day` to adjust the
// elimination order will go here, for now it changes nothing
function applyDayOverrides(rankedSurvivors: RankedSurvivor[]): RankedSurvivor[] {
    return rankedSurvivors;
}

function assignEliminationOrder(rankedSurvivors: RankedSurvivor[]): CompetingEntity[] {
    const sortedSurvivors = [...rankedSurvivors].sort(function(a, b) {
        return a.finishKey - b.finishKey;
    });

    let eliminationOrderCounter = 0;
    let previousFinishKey = 0;
    const contestantsWithEliminationOrder = sortedSurvivors.map(function(survivor) {
        let eliminationOrder = Number.MAX_VALUE;
        if (survivor.finishKey !== 0) {
            if (survivor.finishKey !== previousFinishKey) {
                // shared placements keep the same order, the next exit takes the next number
                eliminationOrderCounter++;
                previousFinishKey = survivor.finishKey;
            }
            eliminationOrder = eliminationOrderCounter;
        }

        return new CompetingEntity({
            teamName: survivor.name,
            relationship: "needed for ITeam",
            isParticipating: survivor.isParticipating,
            eliminationOrder
        });
    });

    return contestantsWithEliminationOrder.sort(function(a, b) {
        return a.eliminationOrder - b.eliminationOrder;
    });
}

function isRecognizedPlacement(cell: string): boolean {
    const compactCell = removeWhitespaceAndToLower(cell);
    return PLACEMENT_VOCABULARY.some((placement) => compactCell.includes(placement));
}

function removeWhitespaceAndToLower(text: string): string {
    return text.replace(/\s+/g, "").toLowerCase();
}
