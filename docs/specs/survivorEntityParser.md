# Spec: `survivorEntityParser` (current behavior)

Source: [app/parsers/survivorEntityParser.tsx](../../app/parsers/survivorEntityParser.tsx)
Tests: [__tests__/parsers/survivorEntityParser.js](../../__tests__/parsers/survivorEntityParser.js)

This documents what the parser does **today**, including quirks. It is the
baseline any refactor must preserve unless a change is called out explicitly.

## Interface

```ts
parseSurvivorEntities(contestantData: ITableRowData[]): CompetingEntity[]
```

- Pure function of its input (aside from `console` logging). No show/season
  context is passed in.
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
| `col3`–`col7` | Status text (see "Status column") |
| `col1` | Unused |

Input order matters: it drives the "previous exit day" used for rows with no
explicit day, and it breaks ties between equal days.

## Output: `CompetingEntity[]`

One entity per non-skipped row:

| Field | Value |
| --- | --- |
| `teamName` | `name \|\| name2` |
| `relationship` | Always the literal `"needed for ITeam"` |
| `isParticipating` | `false` if eliminated, otherwise `true` (winners included) |
| `eliminationOrder` | `1..N` for eliminated contestants; `Number.MAX_VALUE` for everyone else |

Returned sorted by `eliminationOrder` ascending: eliminated contestants first
(first out = `1`), then still-active contestants and the winner, in input order.

## Behavior

### 1. Row filtering
Rows where `isPartialContestantData(row)` is true are dropped: `name` is empty
**and** (`name2` or `col2` is missing).

### 2. Status column
The status string is the first truthy value checking `col7`, `col6`, `col5`,
`col4`, then `col3` unconditionally — i.e. the right-most populated column.
If the result is `null`/`undefined`, throws
`ReferenceError("Status is either null or undefined and it should not be")`.

### 3. Status interpretation → `finishDay`
Case-insensitive checks, first match wins:

| Status contains | `finishDay` | `isParticipating` |
| --- | --- | --- |
| `day` | `N` from `/Day (\d+)/i` | `false` |
| `runner-up` | `previousFinishDay + 0.5` | `false` |
| `sole survivor` | `0` (winner) | `true` |
| `voted out` | `previousFinishDay + 0.5` | `false` |
| anything else (e.g. `Participating`) | `0` | `true` |

- `previousFinishDay` is the last non-zero `finishDay` seen **in input order**
  (starts at `0`), and is updated by every row that gets a non-zero day.
- A day anywhere in the status wins over everything else, e.g.
  `"Runner-upDay 100"` → day `100`; a right-most column of `"Day 26"` wins over
  `"2nd Runner-up"` in `col4`.
- Matching a day *inside* a longer status (`"Runner-upDay 100"`) is left over
  from when this code was copied from the Big Brother parser. Big Brother
  tables do have cells with both a placement and a day. Survivor tables never
  do: placement and day are always separate cells.

### 4. Elimination order
1. Stable-sort contestants by `finishDay` ascending.
2. Walk the sorted list; each contestant with `finishDay !== 0` gets the next
   counter value starting at `1`. `finishDay === 0` gets `Number.MAX_VALUE`.
3. Sort by `eliminationOrder` ascending and return.

Every eliminated contestant gets a **distinct** order — exits on the same day
are not grouped; ties are broken by input order.

## Known quirks (current, not necessarily desired)

- A status containing "day" without a matching `Day <n>` (e.g. "Today")
  throws a `TypeError` from the non-null assertion on the regex match.
- An empty-string status (`col3: ""`) does not throw; it is treated as
  still participating.
- Statuses like `"Medically evacuated"` or `"Quit"` with no day are treated as
  still participating.
- The fallback block for `finishDay === 0` non-winners sets
  `isParticipating = true` in every branch; it has no effect beyond logging.
- `runner-up` / `voted out` without a day depend on the row above having a
  day; with none they get `0.5`, `1.0`, … and sort before every real day.
- Winner is reported as `isParticipating: true`, indistinguishable from an
  active contestant in the output.

---

# Proposed: `placement` + `day` extraction

Replaces "Status column" and "Status interpretation" above. The single
`rawFinishDay` string becomes two intermediate values. **`placement` drives
elimination order by default**; `day` is carried along only for per-season
overrides.

## What the real rows look like

From the `Survivor_47` and `Survivor_49` fixtures in
[contestantRoundScoreGenerator.js](../../__tests__/generators/contestantRoundScoreGenerator.js):

| Row | col3 | col4 | col5 | col6 | col7 |
| --- | --- | --- | --- | --- | --- |
| Kishan Patel | `4th voted out` | `Day 8` | | | |
| TK Foster | `Tuku` | `2nd voted out` | `Day 5` | | |
| Rome Cooney | `Lavo` | `None[a]` | `6th voted out` | `Day 12` | |
| Jon Lovett | `Gata` | | | `1st voted out` | `Day 3` |
| Sierra Wright | `Gata` | `8th voted out1st jury member` | `Day 15` | | |
| Jeremiah Ing | `3rd voted out` | | | | |
| Nicole Mazullo | `Kele` | | | | `1st voted out` |
| Sam Phalen | `Gata` | `Runner-up` | | | |
| Savannah Louie | `Uli` | `Sole Survivor` | | | |

What this tells us:
- Rows are in finish order: first out at the top, winner at the bottom.
- Tribe columns come before the finish columns, and their count differs
  between rows. Wikipedia `rowspan` cells are only counted on the first row
  they cover, so `placement` and `day` can sit anywhere from `col3` to `col7`.
- When both are present, `day` is always the cell right after `placement`.
- `day` can be missing for two reasons we can't tell apart:
  - **The day cell is shared** with the row above (Jeremiah, Runner-up,
    Sole Survivor).
  - **It got cut off**, because the fetch only reads `td` 0–6 (Nicole's day is
    in a column after `col7`). Tracked in
    [#523](https://github.com/jjm3x3/AmazingRaceFantasy/issues/523).
- `placement` can have extra text stuck on the end (`…1st jury member`).
- Without a placement, the right-most cell is a tribe name. So "right-most
  cell" alone can't be trusted.

## Intermediate shape

```ts
interface SurvivorFinish {
    name: string            // name || name2
    rowIndex: number        // position after partial-row filtering
    placement?: string      // raw text, e.g. "8th voted out1st jury member"
    day?: number            // N from "Day N"
}
```

## Extraction rules (per row)

Only `col3`–`col7` are scanned (`col1` and `col2` are age and hometown).

1. Find the **right-most non-empty** cell.
2. If it matches `^Day\s*(\d+)$`:
   - `day = N`.
   - The cell to its left is `placement`, if that cell is a recognized
     placement. Otherwise `placement` is missing.
3. Else if it is a recognized placement: `placement` = that cell, and `day`
   is missing.
4. Else both are missing. Log a warning if the cell isn't a tribe-like token.

A cell that holds both values (e.g. `Runner-upDay 100`) is **not** split.
Support for that shape is left over from the Big Brother parser this code was
copied from: Big Brother tables have cells like that, Survivor tables do not.
If one ever shows up, it still counts as a recognized placement (it contains
`runner-up`), so it gets `placement` = the whole text and no `day`.

## Filling in a missing `day` (across rows)

After every row is extracted, a row that **has a `placement` but no `day`**
takes the `day` of the nearest earlier row that has one. This mirrors a
Wikipedia `rowspan` day cell, which is only counted on the first row it
covers. Rows with no `placement` (still in play) never take a day.

This relies on [#523](https://github.com/jjm3x3/AmazingRaceFantasy/issues/523)
landing first. Otherwise, a day lost to the column cut-off would silently be
replaced by the previous row's day.

Example (Survivor 49): Jeremiah (`3rd voted out`) takes Day 6 from Jake;
Runner-up and Sole Survivor take Day 26 from 2nd runner-up.

**Recognized placement** is matched case-insensitively against a closed
vocabulary: `voted out`, `eliminated`, `medically evacuated`, `quit`,
`removed`, `runner-up`, `sole survivor`. Anything else (tribe names,
`None[a]`, `Participating`) is not a placement.

A row with nothing in `col3`–`col7` is no longer a `ReferenceError`; the
contestant is treated as still in play, since mid-season, active players
likely have empty finish cells. The existing "should throw … missing status"
test changes to match.

## From `placement` to a sort key (replaces `finishDay`)

This works the same way `finishDay` does today, but reads `placement`
instead of the day:

| `placement` | `finishKey` | `isParticipating` |
| --- | --- | --- |
| missing | `0` | `true` |
| contains `sole survivor` | `0` (winner) | `true` |
| starts with `Nth voted out` | `N` | `false` |
| any other recognized placement (eliminated, medevac, quit, runner-ups) | `previousKey + 0.5` | `false` |

`previousKey` is the last non-zero key in row order. Elimination-order
assignment (step 4 above) stays the same, using `finishKey` instead of
`finishDay`.

Example (Survivor 49): `1st` → 1, `2nd` → 2, Medevac → 2.5, `3rd` → 3, …,
`13th` → 13, Eliminated → 13.5, 2nd runner-up → 14, Runner-up → 14.5,
Sole Survivor → winner.

## `day` overrides (to be designed)

`day` does not affect the default ordering. Overrides are keyed by show and
season, and are the only place `day` (or explicit names) can change the
`eliminationOrder` assignment, e.g. to put two exits in one round. This
spec only promises that `day` reaches that stage when the row has one.

## Decisions

1. **Missing `day`:** inherited from the nearest earlier row with a day;
   only rows that have a placement inherit.
2. **Cut-off day:** fixed in the fetch by reading more columns,
   [#523](https://github.com/jjm3x3/AmazingRaceFantasy/issues/523). That is
   a prerequisite for decision 1.
3. **Rows with no status:** treated as still in play, not an error.
4. **Sort key:** `Nth voted out` → N; other exits → previous key + 0.5.
   `rowIndex` is not used for ordering.
5. **Combined cell:** not split. It came from the Big Brother parser, and
   Survivor tables never format cells that way.

## Test changes implied

- "should throw an error for a contestantData w/ a missing status" → expects
  an active contestant instead.
- "Should parse out ending day from status when status is runner-up" still
  passes as written (runner-up → key 0.5 → order 1). It should be rewritten
  with separate placement and day cells, so it stops depending on a
  Big Brother cell shape that Survivor tables never use.
