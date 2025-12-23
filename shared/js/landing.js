import { loadAttemptModels } from './loaders/loadAttemptModels.js';

(async function landing() {
    try {
        const cards = document.querySelectorAll('.landing-card');

        for (const card of cards) {
            const game = card.dataset.game;

            // load attempts for this game
            const { attemptModels, _ } = await loadAttemptModels(game);

            // compute stats
            const totalAttempts = attemptModels.length;
            const totalSuccesses = attemptModels.filter(a => a.success).length;

            // inject into card
            const statsDiv = card.querySelector('.basic-stats');
            statsDiv.innerHTML = `
                <p>Attempts (Successes): ${totalAttempts} (${totalSuccesses})</p>
            `;
        }
    } catch (error) {
        console.error("Error loading landing stats:", error);
    }
})();
