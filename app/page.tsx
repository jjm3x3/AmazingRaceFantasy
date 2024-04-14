import Link from 'next/link'
import fs from 'fs'

export default function Home() {

    const currentDirFilesList = fs.readdirSync(__dirname)
    let archiveDirFilesList: string[] = []

    if (currentDirFilesList.includes("archive")) {
        console.log("Yay there is an 'archive' folder and it's contents are:")
        archiveDirFilesList = fs.readdirSync(__dirname+"/archive")
        console.log(archiveDirFilesList)
    }

    return (
        <div>
            <header>
                <p className="page-title">X Factor Fantasy</p>
            </header>
            <main>
                <p className="site-notice">
                    Welcome to X Factor Fantasy! A new season of the Amazing Race has just begun!
                    <br/>
                    <a className="standard-link" href="/scoring"> Jump Into The Action</a>
                </p>
                <p className="league-link-heading" >Links For The Current League</p>
                <div className="flex flex-row">
                    <Link className="standard-link league-page-link" href="/contestants">Contestants</Link>
                    <Link className="standard-link league-page-link" href="/scoring">Scoring</Link>
                    <Link className="standard-link league-page-link" href="/league-standing">League Standing</Link>
                </div>
                {archiveDirFilesList.map(s => {
                    const friendlyName = s.replaceAll("-", " ")
                    // TODO capitalize show name
                    const contestantsPath = "/archive/" + s + "/contestants"
                    const scoringPath = "/archive/" + s + "/scoring"
                    const leagueStandingPath = "/archive/" + s +"/league-standing"

                    return <>
                        <p className="league-link-heading" >Links For {friendlyName} League</p>
                        <div className="flex flex-row">
                            <Link className="standard-link league-page-link" href={contestantsPath}>Contestants</Link>
                            <Link className="standard-link league-page-link" href={scoringPath}>Scoring</Link>
                            <Link className="standard-link league-page-link" href={leagueStandingPath}>League Standing</Link>
                        </div>
                    </>
                })}
            </main>
        </div>
    )
}
