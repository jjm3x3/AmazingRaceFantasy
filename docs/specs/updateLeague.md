# Spec: Update League

Issue: [#439 Create League Edit page](https://github.com/jjm3x3/AmazingRaceFantasy/issues/439)
(milestone "Enable League Updates")

This is the **target** behavior of the update league feature: a page,
pre-filled with a league's stored configuration, where the league's owner
can change it and save. The choices made along the way are collected under
"Decisions" at the end.

## Parts

| Part | Location |
| --- | --- |
| Edit page | `app/league/[showStatus]/[showNameAndSeason]/configuration/page.tsx` |
| Form | Shared with the create page, `app/league/configuration/form/form.tsx` |
| Update endpoint | `PUT /api/league/[leagueId]`, `app/api/league/[leagueId]/route.ts` |
| Storage | `updateLeagueConfigurationData` in [dbFetch.tsx](../../app/dataSources/dbFetch.tsx) |
| Entry point | "Edit League" link on the `league-details` page |

## Terms

| Term | Example | Notes |
| --- | --- | --- |
| league key | `big_brother:28` | `showName:showSeason`. Identifies a league today. Never changes. |
| league id | `big_brother:28` | What the API uses to name a league. Opaque to the client: the server hands it out and the client sends it back unchanged, never builds or parses it. **Today it is the league key**; see "Future work: `leagueId`". |
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

Today's `PUT /api/league` only lets you change `googleSheetUrl` and
`leagueStatus`. This feature widens that to every field the create form
sets, except the league key.

## Edit page

URL: `/league/<status>/<slug>/configuration`, e.g.
`/league/active/big-brother-28/configuration`.

- Heading "Edit League", with the league (`big-brother-28`) named under it.
- Renders on the server **at request time** (`dynamic = "force-dynamic"`),
  not at build time, so it always shows what is stored now. A page built at
  deploy time would show values from before every edit made since, and a
  league whose status changed would 404 at its new URL until the next build.
- A URL with no stored league is a 404 (`notFound()` when there is no
  configuration at `league_configuration:<status>:<league key>`).
- Reads the configuration with `getLeagueConfigurationData` and maps it to
  the form fields (see the table above):
  - `wikiPageName` = `wikiPageUrl` without the `https://en.wikipedia.org/wiki/` prefix
  - `leagueStatus` `archive` → `archived` option
- Works out the league id on the server and passes it to the form as a
  prop. This is the only place the client gets it from.
- Anyone can open the page; it does not read the session. The same values
  are already public on `league-details`. Only the owner can save, which the
  endpoint enforces: anyone else gets a 403 and the unauthorized message.

## Form

The create form, in an edit mode. Same fields, labels, placeholders and
validation patterns. Differences in edit mode:

| | Create | Edit |
| --- | --- | --- |
| Starting values | Empty | Stored values (page section above) |
| Show name / season | Editable | Shown, not editable, not sent |
| Starts valid? | No (submit disabled) | Yes, when the stored values pass validation |
| Button | "Create League" | "Update League" |
| Request | `POST /api/league` | `PUT /api/league/<league id>`, with the id from the page prop, URL-encoded (`encodeURIComponent`) |
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
| 404 | `LEAGUE_NOT_FOUND_ERROR_MESSAGE` (new, in [errorMsgs.tsx](../../app/dataSources/errorMsgs.tsx)): "This league could not be found. It may have been moved or archived; refresh and try again." |
| anything else | `GENERIC_FORM_ERROR_MESSAGE` |

## Update endpoint: `PUT /api/league/[leagueId]`

This replaces `PUT /api/league` (league key in the body). `POST /api/league`
does not change. The league id goes in the path, so the URL names the
resource being updated, and the body holds only what changes.

Only the route turns a league id into storage keys. Clients and the rest of
the request handling treat it as an opaque string, so switching to a real
`leagueId` later changes the lookup here and nothing in the contract.

### Request

- Path: `leagueId`, e.g. `/api/league/big_brother:28`. `:` is allowed in a
  path segment, and the route gets the same value whether the client sends
  it raw or as `%3A`. Today it must match `validationPattern.leagueKey`
  (`^[a-zA-Z0-9_:]+$`), so `*` and other redis glob characters are rejected
  before any lookup. It does **not** include the status or the
  `league_configuration:` prefix.
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
| 3 | Path `leagueId` and body pass validation | 400, naming the first bad property (same wording as `POST`) |
| 4 | Exactly one key matches `league_configuration:*:<leagueId>` | none: 404, more than one: 409 |
| 5 | Session user is the stored `createdBy` | 403 |

Only the owner can update a league. A `showAdmin` role does not let a user
update leagues they did not create; this is what `PUT /api/league` does
today.

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
That already writes to `league_configuration:<new status>:<league id>`
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
`/league/configuration`). The link stays behind `userIsLeagueOwner`, which
is still always `false`, so everyone keeps seeing the disabled "Edit League
(owner only)" button. Until the owner check lands, the owner reaches the
edit page by its URL.

Working out `userIsLeagueOwner` is its own issue. `league-details` is built
at build time, so it cannot read the session there; the likely approach is
to compare the session context with the stored `createdBy` on the client.

## Tests

Endpoint (`__tests__/api/league/[leagueId]/route.js`; the `PUT (unit
tests)` block moves out of `__tests__/api/league/route.js`):
- 401: missing cookie, malformed JWT, no `sub`.
- 400: invalid `leagueId` in the path (space, `*`); each missing or invalid
  body field.
- 404 / 409 from the key lookup; lookup pattern is
  `league_configuration:*:<leagueId>`.
- 403 when the user is not `createdBy`.
- 200: derived `wikiPageUrl`/`wikiApiUrl`, renamed fields, stored fields
  kept (`parserOptions`, link texts, `contestantLeagueDataKeyPrefix`,
  `createdBy`), the found key passed to `updateLeagueConfigurationData`.
- Body `leagueKey` / `createdBy` are ignored.

Form: edit mode pre-fills each field, maps `archive` ↔ `archived`, starts
with submit enabled, locks show name/season, sends `PUT` to
`/api/league/<league id prop>` (not one built from show name and season),
and shows the right message for 401/403/404/other.

## Out of scope

- Changing a league's show name or season (its identity). That is a new
  league.
- Editing `parserOptions` (e.g. `dayOverrides`), link texts, or the
  contestant data key prefix.
- Transferring ownership.
- Deleting a league.
- Showing the `league-details` "Edit League" link to the owner (working out
  `userIsLeagueOwner`).
- A real `leagueId` (next section).

## Future work: `leagueId`

Today the league key (`showName:showSeason`) is a league's identity, part of
its redis key, and (via the URL slug) part of its page URLs. That holds only
while there is at most one league per show and season. Once users outside
the core group can create leagues, two leagues for the same season will
exist, so a league needs an id of its own. This belongs in its own issue.

What that work would cover:
- **A generated id.** Random and URL-safe, assigned by `POST /api/league` and
  never changed. Show name and season become plain fields of the
  configuration.
- **Status out of the key.** `league_configuration:<status>:…` means a
  league's key changes when it is archived, and finding one means a
  wildcard lookup (the 404/409 check above). With an id, the key is just
  the id, status is a field, and lists of active/archived leagues come from
  an index (e.g. a set of ids per status).
- **Contestant data per league.** Picks are stored under `showName:showSeason:*`
  (`contestantLeagueDataKeyPrefix`). They belong to a league, so they move to
  the league id. Wikipedia data stays per show and season, since every league
  for that season shares it.
- **Page URLs.** `getUrlParams` turns `_` into `-` and pages turn `-` back
  into `_`, which breaks for names that contain `-`. Pages would be addressed
  by id (optionally with a readable slug that is ignored when looking the
  league up).
- **Migrating** existing `league_configuration:*` and contestant keys.

What this spec does so that switch is cheap:
- The update endpoint names the league with an opaque `leagueId` that the
  server hands out. Only the lookup inside the route has to change.
- The form sends back the id it was given and never builds one.

## Decisions

1. **Editable fields:** every field the create form sets except show name
   and season, not just `googleSheetUrl` and `leagueStatus`.
2. **Non-owners on the edit page:** the page opens for anyone; saving gives
   a 403 and the unauthorized message.
3. **Who can update:** the owner (`createdBy`) only. `showAdmin` gets no
   extra rights.
4. **After saving:** go to the league's `league-details` page, with the new
   status in the URL.
5. **404 on save:** a new `LEAGUE_NOT_FOUND_ERROR_MESSAGE`.
6. **Owner check for the `league-details` link:** its own issue. Here the
   link only changes where it points.
7. **League identity in the API:** an opaque league id, which is the league
   key for now. A real `leagueId` is future work.
