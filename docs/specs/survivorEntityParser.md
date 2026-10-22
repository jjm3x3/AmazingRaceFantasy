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
