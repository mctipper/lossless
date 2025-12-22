export class GameModel {
    // where and who cause this death
    constructor(date, success, world, level, deathPlayer, deathCharacter, levelsData) {
        this.date = date;
        this.success = success;

        // hacky data validation, force fields to behave when successful run
        if (success) {
            // return max 'world' in levels dataset, since we were successful just recorded as last level
            this.world = Math.max(...Object.keys(levelsData).map(Number));
            this.level = Math.max(...Object.keys(levelsData[this.world]).map(Number));
            // no death recorded since successful obvs
            this.deathPlayer = "";
            this.deathCharacter = "";
        } else {
            this.world = world;
            this.level = level;
            this.deathPlayer = deathPlayer;
            this.deathCharacter = deathCharacter;
        }

        this.level_name = levelsData[this.world]?.[this.level] || "Unknown Level";
    }

    format() {
        if (this.success) {
            return `Successful run!`
        } else {
            return `${this.deathPlayer} died as ${this.deathCharacter} on ${this.level_name} (World ${this.world}, Level ${this.level}) on ${this.date}`;
        }
    }
}