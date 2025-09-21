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
        string: "^(?:(?:(?:https):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$" // eslint-disable-line no-useless-escape
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
