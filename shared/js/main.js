import { getPageName } from './pages.js';
import { loadGameModels } from './loaders/loadGameModels.js';
import { loadGameMeta } from './loaders/loadGameMeta.js';

import { buildStatsBox } from './charts/statsBox.js'
import { buildPiePlayerDeath } from './charts/piePlayerDeath.js'
import { buildPieCharacterDeath } from './charts/pieCharacterDeath.js'
import { buildPlayerCharacterDeathBarChart } from './charts/barPlayerCharacterDeath.js'
import { buildStreakPlot } from './charts/linePlayerDeathStreak.js'
import { buildAttemptBar } from './charts/barAttempt.js'

(async function main() {
    try {
        const page = getPageName();

        // load up the games for THIS page
        const { gameModels, levelsData } = await loadGameModels(page);
        const { about, colours } = await loadGameMeta(page);


        // update display
        document.getElementById("gameTitle").textContent = `Lossless ${about.abbreviation}`;
        document.getElementById("gameSubtitle").textContent = about.blurb;
        document.getElementById("gameSmallText").textContent = about.smallText;
        document.title = `Lossless ${about.abbreviation}`;


        // stats box
        buildStatsBox(gameModels);

        // death charts
        buildPiePlayerDeath(gameModels, colours);
        buildPieCharacterDeath(gameModels, colours);
        buildPlayerCharacterDeathBarChart(gameModels, colours);

        // death streak
        buildStreakPlot(gameModels, colours);

        // game attempt
        buildAttemptBar(gameModels, levelsData, colours);
        buildAttemptBar(gameModels, levelsData, colours, true);

    } catch (error) {
        console.error("Error in render script:", error);
    }
})();
