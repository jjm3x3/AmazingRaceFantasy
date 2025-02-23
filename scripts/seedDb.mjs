import fs from "node:fs"
import { kv } from "@vercel/kv"
import { CONTESTANT_LEAGUE_DATA } from "../app/leagueData/AmazingRace_35.js"

console.log("Seeding the db")

console.log(CONTESTANT_LEAGUE_DATA)

