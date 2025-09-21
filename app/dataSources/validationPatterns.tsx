import * as z from "zod/v4";

const validationPattern = {
    wikiPageName: {
        zod: z.string().regex(/^[a-zA-Z()_0-9]+$/),
        string: "^[a-zA-Z()_0-9]+$"
    },
    googleSheetsUrl: {
        zod: z.url({
            protocol: /^https$/,
            hostname: z.regexes.domain
        }),
        string: "[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?" // eslint-disable-line no-useless-escape
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
        string: "^[a-zA-Z0-9]+$"
    },
    leagueKey: {
        zod: z.string().regex(/^[a-zA-Z0-9_:]+$/),
        string: "^[a-zA-Z0-9_:]+$"
    }
}

export default validationPattern;
