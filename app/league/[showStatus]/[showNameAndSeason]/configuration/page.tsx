import { notFound } from "next/navigation";
import { getLeagueConfigurationData, ILeagueConfigurationData } from "@/app/dataSources/dbFetch";
import LeagueConfigurationForm from "@/app/league/configuration/form/form";

// Render on every request so the form always shows what is stored now, and so a league
// that moved to a new status is found at its new url without a rebuild
export const dynamic = "force-dynamic";

const wikiPageUrlPrefix = "https://en.wikipedia.org/wiki/";

export default async function LeagueConfigurationEdit({ params }: {
    params: Promise<{ showStatus: string; showNameAndSeason: string }>
  }) {
    const { showNameAndSeason, showStatus } = await params;
    const showAndSeasonArr = showNameAndSeason.split("-");
    const showSeason = showAndSeasonArr.pop() ?? "";
    const showName = showAndSeasonArr.join("_");
    const leagueId = `${showName}:${showSeason}`;

    let leagueConfigurationData: ILeagueConfigurationData;
    try {
        leagueConfigurationData = await getLeagueConfigurationData(`league_configuration:${showStatus}:${leagueId}`);
    } catch {
        notFound();
    }

    const wikiPageUrl = leagueConfigurationData.wikiPageUrl;
    const league = {
        leagueId,
        urlSlug: showNameAndSeason,
        wikiPageName: wikiPageUrl.startsWith(wikiPageUrlPrefix) ? wikiPageUrl.slice(wikiPageUrlPrefix.length) : wikiPageUrl,
        wikiSectionHeader: leagueConfigurationData.castPhrase,
        showName,
        showSeason,
        contestantType: leagueConfigurationData.competitingEntityName,
        leagueStatus: leagueConfigurationData.leagueStatus,
        googleSheetUrl: leagueConfigurationData.googleSheetUrl
    };

    return (
        <div>
            <h2 className="text-2xl text-center">Edit League</h2>
            <p className="text-center text-sm text-gray-600">{showNameAndSeason}</p>
            <LeagueConfigurationForm league={league} />
        </div>
    );
}
