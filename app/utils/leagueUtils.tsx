
export interface SeasonNameRepo {
    urlSlug: string
    friendlyName: string
}

export function transformFilenameToSeasonNameRepo(fileName: string): SeasonNameRepo {
    const showAndSeason = fileName.split('_');
    const showNameArray = showAndSeason[0].split(/(?<![A-Z])(?=[A-Z])/);
    const showNameFormatted = showNameArray.join('-').toLowerCase();
    const showSeason = showAndSeason[1].replace('.js', '');
    const showNameAndSeason = `${showNameFormatted}-${showSeason}`;
    let friendlyName = `${showNameArray.join(' ')} ${showSeason}`;

    return { urlSlug: showNameAndSeason, friendlyName: friendlyName }
}

