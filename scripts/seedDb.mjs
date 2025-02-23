import { CONTESTANT_LEAGUE_DATA } from "../app/leagueData/AmazingRace_35.js"
import { Redis } from "@upstash/redis"

console.log("Seeding the db")

console.log(CONTESTANT_LEAGUE_DATA)

console.log("Connecting to: '" + process.env.KV_REST_API_URL + "'")
