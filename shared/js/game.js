import { getPageName } from './pages.js';
import { loadAttemptModels } from './loaders/loadAttemptModels.js';
import { loadGameMeta } from './loaders/loadGameMeta.js';

import { buildStatsBox } from './charts/statsBox.js'
import { buildPiePlayerDeath } from './charts/piePlayerDeath.js'
import { buildPieCharacterDeath } from './charts/pieCharacterDeath.js'
import { buildPlayerCharacterDeathBarChart } from './charts/barPlayerCharacterDeath.js'
import { buildAttemptBar } from './charts/barAttempt.js'

(async function game() {
    try {
        const page = getPageName();

        // load up the games for THIS page
        const { attemptModels, levelsData } = await loadAttemptModels(page);
        const { about, colours } = await loadGameMeta(page);


        // update display
        document.getElementById("gameTitle").textContent = `Lossless ${about.abbreviation}`;
        document.getElementById("gameSubtitle").textContent = about.blurb;
        document.getElementById("gameSmallText").textContent = about.smallText;
        document.title = `Lossless ${about.abbreviation}`;


        // stats box
        buildStatsBox(attemptModels, colours);

        // death charts
        buildPiePlayerDeath(attemptModels, colours);
        buildPieCharacterDeath(attemptModels, colours);
        buildPlayerCharacterDeathBarChart(attemptModels, colours);

        // game attempt
        buildAttemptBar(attemptModels, levelsData, colours);
        buildAttemptBar(attemptModels, levelsData, colours, true);

    } catch (error) {
        console.error("Error in render script:", error);
    }
})();
