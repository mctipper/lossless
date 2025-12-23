import { GameModel } from '../models/game.js';

export async function loadGameModels(page) {
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
        const gameModels = flattenedGamesData.map(entry => {
            return new GameModel(
                entry.date,
                entry.success,
                entry.world,
                entry.level,
                entry.deathPlayer,
                entry.deathCharacter,
                levelsData
            );
        });

        return { gameModels, levelsData };
    } catch (error) {
        console.error("Error loading game or level data:", error);
    }
}
