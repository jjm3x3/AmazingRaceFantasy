import { getLeagueConfigurationData, getLeagueConfigurationKeys } from "@/app/dataSources/dbFetch";
import { getUrlParams } from "@/app/utils/pages";
import LeagueConfigurationEditForm from "./form";

// This forces Next to only generate routes that exist in generateStaticParams, otherwise return a 404
export const dynamicParams = false

// Creates routes for all existing leagues
export async function generateStaticParams() {
    const leagueConfigurationKeys = await getLeagueConfigurationKeys();
    const params = await getUrlParams(leagueConfigurationKeys);
    return params;
}

export default async function LeagueConfigurationEdit({ params }: {
    params: Promise<{ showStatus: string; showNameAndSeason: string }>
  }) {
    const { showNameAndSeason, showStatus } = await params;
    const showAndSeasonArr = showNameAndSeason.split("-");
    const showSeason = showAndSeasonArr.at(-1);
    showAndSeasonArr.pop();
    const showName = showAndSeasonArr.join("_");

    const leagueConfigurationKey = `league_configuration:${showStatus}:${showName}:${showSeason}`;
    const leagueConfigurationData = await getLeagueConfigurationData(leagueConfigurationKey);

    return (
        <div>
            <h2 className="text-2xl text-center">Edit League Configuration</h2>
            <p className="text-center text-sm text-gray-600">Editing configuration for {showNameAndSeason}</p>
            <LeagueConfigurationEditForm 
                initialData={leagueConfigurationData}
                leagueConfigurationKey={leagueConfigurationKey}
                showName={showName}
                showStatus={showStatus}
                showSeason={showSeason}
            />
        </div>
    );
}
