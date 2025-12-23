import { AttemptModel } from '../models/attempt.js';

export async function loadAttemptModels(page) {
    try {
        const base = `${page}/data`;

        const gamesPath = `${base}/attempts.json`;
        const levelsPath = `${base}/levels.json`;

        const [gamesResponse, levelsResponse] = await Promise.all([
            fetch(gamesPath),
            fetch(levelsPath)
        ]);

        const gamesData = await gamesResponse.json();
        const levelsData = await levelsResponse.json();

        const attemptModels = Object.entries(gamesData).map(([attemptKey, entry]) => {
            return new AttemptModel(
                attemptKey,
                entry.date,
                entry.success,
                entry.deathLevel,
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
