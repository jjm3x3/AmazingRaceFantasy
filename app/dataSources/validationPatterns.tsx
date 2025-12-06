import * as z from "zod/v4";

const validationPattern = {
    wikiPageUrl: {
        zod: z.string().regex(/^[a-zA-Z()_0-9]+$/),
        string: "^[a-zA-Z()_0-9]+$"
    },
    googleSheetUrl: {
        zod: z.url({
            protocol: /^https$/,
            hostname: z.regexes.domain
        }),
        string: "^https://.*$" // eslint-disable-line no-useless-escape
    },
    leagueStatus: {
        zod: z.enum(["active","archive"]),
        string: "(active|archive)"
    },
    wikiSectionHeader: {
        zod: z.string(),
        string: "^[a-zA-Z0-9]+$"
    },
    contestantType: {
        zod: z.string(),
        string: "^[a-zA-Z0-9 ]+$"
    },
    leagueKey: {
        zod: z.string().regex(/^[a-zA-Z0-9_:]+$/),
        string: "^[a-zA-Z0-9_:]+$"
    }
}

export default validationPattern;
