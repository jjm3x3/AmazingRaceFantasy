# Spec: Update League

Issue: [#439 Create League Edit page](https://github.com/jjm3x3/AmazingRaceFantasy/issues/439)
(milestone "Enable League Updates")

This is the **target** behavior of the update league feature: a page,
pre-filled with a league's stored configuration, where the league's owner
can change it and save. Items marked **Decision** are proposals that still
need sign-off; they are collected again under "Open questions".

## Parts

| Part | Location |
| --- | --- |
| Edit page | `app/league/[showStatus]/[showNameAndSeason]/configuration/page.tsx` |
| Form | Shared with the create page, `app/league/configuration/form/form.tsx` |
| Update endpoint | `PUT /api/league/[leagueKey]`, `app/api/league/[leagueKey]/route.ts` |
| Storage | `updateLeagueConfigurationData` in [dbFetch.tsx](../../app/dataSources/dbFetch.tsx) |
| Entry point | "Edit League" link on the `league-details` page |

## Terms

| Term | Example | Notes |
| --- | --- | --- |
| league key | `big_brother:28` | `showName:showSeason`. Identifies a league. Never changes. |
| league status | `active` / `archive` | Stored value. The form shows `archive` as "Archived". |
| configuration key | `league_configuration:active:big_brother:28` | `league_configuration:<status>:<league key>`. The redis key. Changes when status changes. |
| URL slug | `big-brother-28` | League key with `_` and `:` turned into `-` (`getUrlParams`). |

## Stored configuration (`ILeagueConfigurationData`)

What the edit flow does to each stored field:

| Field | Edit flow | Form field |
| --- | --- | --- |
| `wikiPageUrl` | Editable, derived | `wikiPageName` (page name only, without the `https://en.wikipedia.org/wiki/` prefix) |
| `wikiApiUrl` | Derived from `wikiPageName`, never shown | — |
| `castPhrase` | Editable | `wikiSectionHeader` |
| `competitingEntityName` | Editable | `contestantType` |
| `leagueStatus` | Editable | `leagueStatus` |
| `googleSheetUrl` | Editable | `googleSheetUrl` |
| `preGoogleSheetsLinkText` | Kept as stored | — |
| `postGoogleSheetsLinkText` | Kept as stored | — |
| `contestantLeagueDataKeyPrefix` | Kept as stored | — |
| `createdBy` | Kept as stored | — |
| `parserOptions` | Kept as stored | — |
| show name, show season | Shown read only (part of the league key) | `showName`, `showSeason` |

The editable set is the create form's fields minus the two that make up the
league key, so the derivations match `POST /api/league` exactly.

**Decision:** today's `PUT /api/league` only lets you change
`googleSheetUrl` and `leagueStatus`. This spec widens that to every field
the create form sets, except the league key.

## Edit page

URL: `/league/<status>/<slug>/configuration`, e.g.
`/league/active/big-brother-28/configuration`.

- Heading "Edit League", with the league (`big-brother-28`) named under it.
- Has one route per stored league. Any other URL is a 404 (same
  `generateStaticParams` / `dynamicParams = false` as the `league-details`
  page).
- Renders on the server **at request time**, not at build time, so it always
  shows what is stored now. A page built at deploy time would show values
  from before every edit made since.
- Reads the configuration with `getLeagueConfigurationData` and maps it to
  the form fields (see the table above):
  - `wikiPageName` = `wikiPageUrl` without the `https://en.wikipedia.org/wiki/` prefix
  - `leagueStatus` `archive` → `archived` option
- **Decision:** who can open the page. Proposal: anyone can open it (the
  same values are already public on `league-details`); only the owner can
  save, which the endpoint enforces. See "Open questions".

## Form

The create form, in an edit mode. Same fields, labels, placeholders and
validation patterns. Differences in edit mode:

| | Create | Edit |
| --- | --- | --- |
| Starting values | Empty | Stored values (page section above) |
| Show name / season | Editable | Shown, not editable, not sent |
| Starts valid? | No (submit disabled) | Yes, when the stored values pass validation |
| Button | "Create League" | "Update League" |
| Request | `POST /api/league` | `PUT /api/league/<league key>` |
| On success | Go to `/` | Go to the league's `league-details` page, using the **new** status in the URL |

- If a stored value does not pass its field's pattern (older data), that
  field shows as invalid and submit stays disabled until it is fixed.
- The submit button is disabled while any field is invalid, the same as
  create.
- The body sends only the editable fields, with `archived` turned back into
  `archive`.
- Errors show above the form, the same way as create:

| Status | Message |
| --- | --- |
| 401 | `UNAUTHENTICATED_ERROR_MESSAGE` |
| 403 | `UNAUTHORIZED_ERROR_MESSAGE` |
| 404 | **Decision:** new message, e.g. "This league no longer exists." |
| anything else | `GENERIC_FORM_ERROR_MESSAGE` |

## Update endpoint: `PUT /api/league/[leagueKey]`

This replaces `PUT /api/league` (league key in the body). `POST /api/league`
does not change. The league key goes in the path, so the URL names the
resource being updated, and the body holds only what changes.

### Request

- Path: `leagueKey`, e.g. `/api/league/big_brother:28`. Must match
  `validationPattern.leagueKey` (`^[a-zA-Z0-9_:]+$`), so `*` and other redis
  glob characters are rejected before any lookup. It does **not** include the
  status or the `league_configuration:` prefix.
- Cookie: `session`.
- Body (JSON), every field required:

| Field | Validation |
| --- | --- |
| `wikiPageName` | `validationPattern.wikiPageUrl` |
| `wikiSectionHeader` | `validationPattern.wikiSectionHeader` |
| `contestantType` | `validationPattern.contestantType` |
| `leagueStatus` | `validationPattern.leagueStatus` |
| `googleSheetUrl` | `validationPattern.googleSheetUrl` |

- Other body fields (`leagueKey`, `createdBy`, `parserOptions`, …) are
  ignored. They can never change who owns a league or which league is
  written.
- Every editable field is required (a full replace, as `PUT` is), not a
  partial update.

### Checks, in order

The first one that fails decides the response:

| # | Check | Response |
| --- | --- | --- |
| 1 | `session` cookie present and a well-formed JWT | 401 |
| 2 | Cookie decrypts and has a `sub` (user id) | 401 |
| 3 | Path `leagueKey` and body pass validation | 400, naming the first bad property (same wording as `POST`) |
| 4 | Exactly one key matches `league_configuration:*:<leagueKey>` | none: 404, more than one: 409 |
| 5 | Session user is the stored `createdBy` | 403 |

**Decision:** whether a `showAdmin` may also update leagues they did not
create. Proposal: no, owner only, which is what `PUT /api/league` does today.

### Write

Builds the new configuration:

| Field | Value |
| --- | --- |
| `wikiPageUrl` | `https://en.wikipedia.org/wiki/<wikiPageName>` |
| `wikiApiUrl` | `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=<wikiPageName>` |
| `castPhrase` | `wikiSectionHeader` |
| `competitingEntityName` | `contestantType` |
| `leagueStatus` | `leagueStatus` |
| `googleSheetUrl` | `googleSheetUrl` |
| everything else | stored value, unchanged (`createdBy` included) |

Calls `updateLeagueConfigurationData(<found configuration key>, config)`.
That already writes to `league_configuration:<new status>:<league key>`
and deletes the old key in one transaction, so:

- Same status: the configuration is overwritten in place.
- New status: the configuration moves to the new key and the old key is
  gone. URLs with the old status 404 from then on.

A league with no stored `parserOptions` still has none afterwards (the field
is not written as `null`).

### Response

`200 {"message": "updated"}`. Errors are `{"error": "<message>"}` with the
status from the checks table.

## Entry point

On `league-details`, the "Edit League" link goes to
`/league/<status>/<slug>/configuration` (today it goes to the create page,
`/league/configuration`). It shows only to the league's owner; everyone else
sees the disabled "Edit League (owner only)" button, as now.

**Decision:** how the page knows the viewer is the owner. `league-details`
is built at build time, so it cannot read the session there. Proposal: check
on the client with the session context and the stored `createdBy`. Could be
split into its own issue.

## Tests

Endpoint (`__tests__/api/league/[leagueKey]/route.js`; the `PUT (unit
tests)` block moves out of `__tests__/api/league/route.js`):
- 401: missing cookie, malformed JWT, no `sub`.
- 400: invalid `leagueKey` in the path (space, `*`); each missing or invalid
  body field.
- 404 / 409 from the key lookup; lookup pattern is
  `league_configuration:*:<leagueKey>`.
- 403 when the user is not `createdBy`.
- 200: derived `wikiPageUrl`/`wikiApiUrl`, renamed fields, stored fields
  kept (`parserOptions`, link texts, `contestantLeagueDataKeyPrefix`,
  `createdBy`), the found key passed to `updateLeagueConfigurationData`.
- Body `leagueKey` / `createdBy` are ignored.

Form: edit mode pre-fills each field, maps `archive` ↔ `archived`, starts
with submit enabled, locks show name/season, sends `PUT` to the right URL,
and shows the right message for 401/403/404/other.

## Out of scope

- Changing a league's show name or season (its identity). That is a new
  league.
- Editing `parserOptions` (e.g. `dayOverrides`), link texts, or the
  contestant data key prefix.
- Transferring ownership.
- Deleting a league.

## Open questions

1. Widen the editable fields past `googleSheetUrl` and `leagueStatus`, as
   above?
2. Can a non-owner open the edit page (and get a 403 on save), or should
   it redirect/deny?
3. Owner only, or also `showAdmin`?
4. Where to go after saving: `league-details` (proposed) or `/`?
5. 404 message text.
6. Owner check for the `league-details` link: in this issue or its own?
