import { AttemptModel } from '../models/game.js';

export async function loadAttemptModels(page) {
    try {
        const base = `${page}/data`;

        const gamesPath = `${base}/games.json`;
        const levelsPath = `${base}/levels.json`;

        const [gamesResponse, levelsResponse] = await Promise.all([
            fetch(gamesPath),
            fetch(levelsPath)
        ]);

        const gamesData = await gamesResponse.json();
        const levelsData = await levelsResponse.json();

        const flattenedGamesData = Object.values(gamesData);
        const attemptModels = flattenedGamesData.map(entry => {
            return new AttemptModel(
                entry.date,
                entry.success,
                entry.world,
                entry.level,
                entry.deathPlayer,
                entry.deathCharacter,
                levelsData
            );
        });

        return { attemptModels, levelsData };
    } catch (error) {
        console.error("Error loading game or level data:", error);
    }
}
