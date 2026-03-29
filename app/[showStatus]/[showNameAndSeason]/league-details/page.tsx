import Link from "next/link";
import { getLeagueConfigurationData, getLeagueConfigurationKeys } from "@/app/dataSources/dbFetch";
import { getUrlParams } from "@/app/utils/pages";

// This forces Next to only generate routes that exist in generateStaticParams, otherwise return a 404
export const dynamicParams = false

// Creates routes for league details
export async function generateStaticParams() {
    const leagueConfigurationKeys = await getLeagueConfigurationKeys();
    const params = await getUrlParams(leagueConfigurationKeys);
    return params;
}

export default async function LeagueDetails({ params }: {
    params: Promise<{ showStatus: string; showNameAndSeason: string }>
  }) {
    const { showNameAndSeason, showStatus } = await params;
    const showAndSeasonArr = showNameAndSeason.split("-");
    const showSeason = showAndSeasonArr.at(-1);
    showAndSeasonArr.pop();
    const showName = showAndSeasonArr.join("_");

    const leagueConfigurationData = await getLeagueConfigurationData(`league_configuration:${showStatus}:${showName}:${showSeason}`);

    // Owner edit eligibility is not yet implemented; this path is reserved for future permission logic.
    const userIsLeagueOwner = false;

    return (
        <div>
            <h1 className="text-3xl text-center">League Details</h1>
            <p className="text-center text-sm text-gray-600">Configuration for {showNameAndSeason}</p>
            <br />
            <dl className="mx-auto max-w-3xl grid grid-cols-1 gap-2 text-sm" data-testid="league-details-configuration">
                {Object.entries(leagueConfigurationData).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-4 gap-2 p-2 border rounded">
                        <dt className="col-span-1 font-semibold text-gray-700 break-words">{key}</dt>
                        <dd className="col-span-3 text-gray-900 break-words">{value ? value.toString() : "(none)"}</dd>
                    </div>
                ))}
            </dl>
            <br />
            <div className="text-center">
                {userIsLeagueOwner ? (
                    <Link href="/league/configuration" className="btn btn-primary" data-testid="league-details-edit-link">
                        Edit League
                    </Link>
                ) : (
                    <button disabled className="btn btn-secondary opacity-50" data-testid="league-details-edit-button" title="Edit option when owner">
                        Edit League (owner only)
                    </button>
                )}
            </div>
        </div>
    );
}
