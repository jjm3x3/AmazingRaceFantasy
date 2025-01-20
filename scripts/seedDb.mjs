import fs from "node:fs"
import { kv } from "@vercel/kv"
import { CONTESTANT_LEAGUE_DATA } from "../app/leagueData"

console.log("Seeding the db")

