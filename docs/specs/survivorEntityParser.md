# Spec: `survivorEntityParser`

Source: [app/parsers/survivorEntityParser.tsx](../../app/parsers/survivorEntityParser.tsx)
Tests: [__tests__/parsers/survivorEntityParser.js](../../__tests__/parsers/survivorEntityParser.js)

This is the **target** behavior of the parser. It replaces the earlier
current-behavior spec; the git history of this file shows what changed
between the two.

## Interface

```ts
parseSurvivorEntities(contestantData: ITableRowData[], parserOptions?: ParserOptions): CompetingEntity[]

interface ParserOptions {
    dayOverrides?: number[]   // see step 5
}
```

- Pure function of its input. The only side effect is `console.warn` (see
  "Warnings"). No show/season context is passed in: anything specific to a
  season comes in only through `parserOptions`. Callers read it from the
  optional `parserOptions` field of that season's league configuration
  (`ILeagueConfigurationData`) and pass it in unchanged; a configuration
  without the field means no options.
- `parserOptions` and each of its fields are optional. Leaving them out
  gives the behavior without the step that option drives. The only option
  today is `dayOverrides`; leaving it out (or passing `[]`) skips step 5.
- `ParserOptions` is shared by every parser, so it is not Survivor
  specific. It lives in
  [ParserOptions.tsx](../../app/models/ParserOptions.tsx). A parser ignores
  options it does not use.
- Selected by `getParser(showName)` in
  [entityParserSwitch.tsx](../../app/utils/entityParserSwitch.tsx) as the
  **fallback** for any show name not matching `amazing_race` or `big_brother`.
- Callers: the `contestants`, `scoring`, `league-standing` and
  `wiki-connection-status` routes.

## Input: `ITableRowData[]`

One object per row of the Wikipedia contestants table, in table order.

| Field | Used for |
| --- | --- |
| `name` | Contestant name (preferred) |
| `name2` | Contestant name fallback; also partial-row check |
| `col2` | Partial-row check only |
| `col3`–`col8` | Tribe, placement and day cells (see "Extraction") |
| `col1` | Unused |

Input order matters: rows are in finish order (first out at the top, winner
at the bottom), and several rules below look at the row above.

## Output: `CompetingEntity[]`

One entity per non-skipped row:

| Field | Value |
| --- | --- |
| `teamName` | `name \|\| name2` |
| `relationship` | Always the literal `"needed for ITeam"` |
| `isParticipating` | `false` if eliminated, otherwise `true` (winner included) |
| `eliminationOrder` | `1..N` for eliminated contestants; `Number.MAX_VALUE` for everyone else |

Returned sorted by `eliminationOrder` ascending: eliminated contestants first
(first out = `1`), then still-active contestants and the winner, in input
order. The winner is still indistinguishable from an active contestant in
the output.

## What the real rows look like

From the `Survivor_47`, `Survivor_49` and `Survivor_50` fixtures in
[__tests__/fixtures](../../__tests__/fixtures):

| Row | col3 | col4 | col5 | col6 | col7 | col8 |
| --- | --- | --- | --- | --- | --- | --- |
| Kishan Patel (47) | `4th voted out` | `Day 8` | | | | |
| Rome Cooney (47) | `Lavo` | `None[a]` | `6th voted out` | `Day 12` | | |
| Sierra Wright (47) | `Gata` | `8th voted out1st jury member` | `Day 15` | | | |
| Nicole Mazullo (49) | `Kele` | | | | `1st voted out` | `Day 3` |
| Jeremiah Ing (49) | `3rd voted out` | | | | | |
| Charlie Davis (50) | `Kalo` | `Cila` | | `6th voted out` | | |
| Chrissy Hofbeck (50) | `Kalo` | `11th & 12th voted out2nd & 3rd jury members` | `Day 16` | | | |
| Benjamin "Coach" Wade (50) | | | | | | |
| Sam Phalen (47) | `Gata` | `Runner-up` | | | | |
| Savannah Louie (49) | `Uli` | `Sole Survivor` | | | | |

What this tells us:
- Tribe columns come before the finish columns, and their count differs
  between rows. Wikipedia `rowspan` cells are only counted on the first row
  they cover, so `placement` and `day` can sit anywhere from `col3` to `col8`.
- When both are present, `day` is always the cell right after `placement`.
- A missing `day` means the day cell is shared with the row above (Jeremiah,
  Charlie, Runner-up, Sole Survivor).
- A completely empty row means **every** cell is shared with the row above,
  placement included (Coach shares Chrissy's double elimination).
- `placement` can have extra text stuck on the end (`…1st jury member`), and
  can name more than one ordinal (`11th & 12th voted out`).
- Without a placement, the right-most cell is a tribe name, so "right-most
  cell" alone can't be trusted.

## Behavior

### 1. Row filtering
Rows where `isPartialContestantData(row)` is true are dropped: `name` is empty
**and** (`name2` or `col2` is missing).

### 2. Extraction (per row)

Each remaining row becomes:

```ts
interface SurvivorFinish {
    name: string            // name || name2
    placement?: string      // raw text, e.g. "8th voted out1st jury member"
    day?: number            // N from "Day N"
}
```

Only `col3`–`col8` are scanned (`col1` and `col2` are age and hometown).

1. Find the **right-most non-empty** cell. If there is none, the row is
   **empty**: no `placement`, no `day` (see step 3).
2. If it matches `^Day\s*(\d+)$`:
   - `day = N`.
   - The cell to its left is `placement`, if that cell is a recognized
     placement. Otherwise `placement` is missing.
3. Else if it is a recognized placement: `placement` = that cell, and `day`
   is missing.
4. Else both are missing (typically a tribe name: the contestant is still in
   play).

**Recognized placement** is matched case-insensitively against a closed
vocabulary: `voted out`, `eliminated`, `medically evacuated`, `quit`,
`removed`, `runner-up`, `sole survivor`. Anything else (tribe names,
`None[a]`, `Participating`) is not a placement.

Matching ignores whitespace: the cell text and the vocabulary are compared
with all whitespace removed, so `Medicallyevacuated` matches
`medically evacuated`. cheerio's `.text()` joins a cell's lines without a
separator, so a `Medically<br>evacuated` cell loses its space. The same goes
for the ordinal pattern in step 4. `placement` itself keeps the raw text.

A cell that holds both values (e.g. `Runner-upDay 100`) is **not** split.
Support for that shape is left over from the Big Brother parser this code was
copied from: Big Brother tables have cells like that, Survivor tables do not.
If one ever shows up, it still counts as a recognized placement (it contains
`runner-up`), so it gets `placement` = the whole text and no `day`.

### 3. Filling in shared cells (across rows)

Applied in row order, after extraction:

1. **Empty row:** takes the `placement` and `day` of the row above. This
   mirrors the fix for shared status cells in the Amazing Race parser
   (Amazing Race 37). If the row above has no `placement`, the empty row
   stays without one and the contestant is still in play. An empty first row
   is still in play.
2. **Missing `day`:** a row that has a `placement` but no `day` takes the
   `day` of the nearest earlier row that has one. Rows with no `placement`
   never take a day.

Examples:
- Survivor 50: Coach takes `11th & 12th voted out…` and Day 16 from Chrissy.
  Charlie takes Day 11 from Angelina.
- Survivor 49: Jeremiah takes Day 6 from Jake. Runner-up and Sole Survivor
  take Day 26 from 2nd runner-up.

### 4. Sort key (`finishKey`)

| `placement` | `finishKey` | `isParticipating` |
| --- | --- | --- |
| missing | `0` | `true` |
| contains `sole survivor` | `0` (winner) | `true` |
| with whitespace removed, matches `^(\d+)(?:st\|nd\|rd\|th)(?:&\d+(?:st\|nd\|rd\|th))?votedout` | first ordinal `N` | `false` |
| any other recognized placement (eliminated, medevac, quit, removed, runner-ups) | `previousKey + 0.5` | `false` |

- `previousKey` is the last non-zero key in row order (starts at `0`).
- The ordinal pattern is anchored to the start, so `2nd runner-up` is **not**
  an ordinal placement; it takes `previousKey + 0.5`.
- Rows sharing a placement (Chrissy and Coach) get the same key, and so the
  same elimination order (step 6).

Examples:
- Survivor 49: `1st` → 1, `2nd` → 2, Medevac → 2.5, `3rd` → 3, …,
  `13th` → 13, Eliminated → 13.5, 2nd runner-up → 14, Runner-up → 14.5,
  Sole Survivor → winner.
- Survivor 50: …, `10th` → 10, Chrissy → 11, Coach → 11, `13th` → 13, ….

### 5. `day` overrides

A step between the sort key and elimination order. It is the only place
`day` can change the `eliminationOrder` assignment.

`parserOptions.dayOverrides` is a list of day numbers. For each listed day
`D`:

1. The **group** is every contestant with `isParticipating === false` and
   `day === D`. Contestants still in play (and the winner, key `0`) are never
   in a group, even when they carry that day.
2. Every contestant in the group takes the **smallest** `finishKey` in the
   group. Nobody outside the group changes.

So everyone who left on that day leaves in the same round, at the position
of the first of them. A listed day with no group (or a group of one) changes
nothing. Duplicate days in the list act like one. Days are not checked
against the table: an override for a day nobody left on is silently a no-op.

The step does not reorder rows, so the stable sort in step 6 keeps the
group in input order, and since days only go up in row order, a group is
always a run of adjacent rows.

Examples (Survivor 50, `parserOptions: { dayOverrides: [11, 13] }`):
- Day 11: Angelina (`5th`, key 5) and Charlie (`6th`, Day 11 taken from
  Angelina in step 3) both get key 5. These were two separate tribal
  councils on one day (#516).
- Day 13: Kamilla (`7th`, Day 13), Genevieve (`8th`) and Colby (`9th`), the
  last two taking Day 13 from Kamilla, all get key 7 (the triple
  elimination, #495).
- Day 16 needs no override: Chrissy and Coach already share a placement
  (#505).

Resulting orders: Jenna 1, Kyle 2, Savannah 3, Q 4, Mike 5, Angelina 6,
Charlie 6, Kamilla 7, Genevieve 7, Colby 7, Dee 8, Chrissy 9, Coach 9,
Christian 10, …, Jonathan 19, Aubry `Number.MAX_VALUE`. 19 rounds instead
of 22.

### 6. Elimination order
1. Stable-sort contestants by `finishKey` ascending.
2. Walk the sorted list; each **distinct** non-zero `finishKey` gets the next
   counter value starting at `1`, and every contestant with that key gets
   that order. `finishKey === 0` gets `Number.MAX_VALUE`.
3. Sort by `eliminationOrder` ascending and return. Contestants with the same
   order keep input order.

Contestants with equal keys (shared placements such as Chrissy and Coach)
get the **same** `eliminationOrder`, so they leave in the same round. The
counter does not skip after a shared order: the next exit takes the next
number. This lines up order numbers with round numbers, though
`League` builds rounds from the distinct orders either way.

Example (Survivor 50): …, Dee → 11, Chrissy → 12, Coach → 12,
Christian → 13, …, Jonathan → 22, Aubry → `Number.MAX_VALUE`.

## Warnings

The parser logs nothing per row. It calls `console.warn` only when:
- a `Day N` cell's left neighbor is not a recognized placement, or
- an empty row has no row above with a `placement` to take.
