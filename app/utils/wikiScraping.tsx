import { JSDOM } from 'jsdom'

export const wikiUrl = "https://en.wikipedia.org/wiki/The_Amazing_Race_35"

export async function getData() {

    const response = await fetch(wikiUrl, {next: { revalidate: 3600 }})
    const responseText = await response.text()
    const doc = new JSDOM(responseText)
    var domQuery = doc.window.document.querySelectorAll(".vcard .fn")

    // Build data model
    const final = []
    // may want to start with eliminationOrder = team.length, but we don't have that right now
    var team = {teamName: "", isParticipating: true, eliminationOrder: 0}
    for (var i = 0; i < domQuery.length; i++) {
        var contestantFullName = domQuery[i].textContent
        var contestantNames = null
        if (contestantFullName == null) {
            console.warn("Found a null contestant Name...")
            continue
        } else {
            contestantNames = contestantFullName.split(" ")
        }
        team.teamName += contestantNames[0]
        if (i % 2 == 0) {
            team.teamName += " & "

            const fullTeamStatus = getFullTeamStatus(domQuery[i])
            team.isParticipating = getIsParticipating(fullTeamStatus)
            if (!team.isParticipating) {
                team.eliminationOrder = getEliminationOrder(fullTeamStatus)
            }
        } else {
            final.push(team)
            team = {teamName: "", isParticipating: true, eliminationOrder: 0}
        }
    }

    return { props: { runners: final } }
}

function getFullTeamStatus(item: any): string {

    var row = null
    if (item !== null &&
        item.parentElement !== null &&
        item.parentElement.parentElement !== null &&
        item.parentElement.parentElement.parentElement !== null &&
        item.parentElement.parentElement.parentElement.parentElement !== null) {
            row = item.parentElement.parentElement.parentElement.parentElement
    }
    return row.lastElementChild.textContent
}

function getIsParticipating(teamStatusFull: string): boolean {

    var teamStatusSimple = teamStatusFull.trim().split(" ")[0]

    return teamStatusSimple === "Eliminated" ? false : true
}

function getEliminationOrder(teamStatusFull: string): number {

    const teamOrderSection = teamStatusFull.trim().split(" ")[1]
    const teamOrderString = teamOrderSection[0]

    return Number(teamOrderString)
}

