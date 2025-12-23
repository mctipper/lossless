export class AttemptModel {
    // where and who cause this death
    constructor(attemptNumber, date, success, deathLevel, deathPlayer, deathCharacter, levelsData) {
        this.attemptNumber = attemptNumber
        this.date = date;
        this.success = success;

        // hacky data validation, force fields to behave when successful run
        if (success) {
            // return max 'world' in levels dataset, since we were successful just recorded as last level
            this.world = Math.max(...Object.keys(levelsData).map(Number));
            this.level = Math.max(...Object.keys(levelsData[this.world].levels).map(Number));
            // no death recorded since successful obvs
            this.deathLevel = deathLevel;
            this.deathPlayer = "";
            this.deathCharacter = "";
        } else {
            const attemptWorldAndLevel = findWorldAndLevel(levelsData, deathLevel);
            this.world = attemptWorldAndLevel.world
            this.level = attemptWorldAndLevel.level
            this.deathLevel = deathLevel;
            this.deathPlayer = deathPlayer;
            this.deathCharacter = deathCharacter;
        }

        this.level_name = levelsData[this.world]?.levels[this.level] || "Unknown Level";
    }

    format() {
        if (this.success) {
            return `Successful run!`
        } else {
            return `${this.deathPlayer} died as ${this.deathCharacter} on ${this.level_name} (World ${this.world}, Level ${this.level}) on ${this.date}`;
        }
    }
}

export function findWorldAndLevel(levelsData, levelString) {
    for (const [worldKey, worldObj] of Object.entries(levelsData)) {
        for (const [levelKey, levelName] of Object.entries(worldObj.levels)) {
            if (levelName === levelString) {
                return {
                    world: worldKey,
                    level: levelKey
                };
            }
        }
    }

    // fallback if not found
    return null;
}
