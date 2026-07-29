export async function loadGameMeta(page) {
    try {
        const [aboutRes, coloursRes] = await Promise.all([
            fetch(`${page}/about.json`),
            fetch(`${page}/colours.json`)
        ]);

        if (!aboutRes.ok || !coloursRes.ok) {
            return undefined;
        }

        const about = await aboutRes.json();
        const colours = await coloursRes.json();

        return { about, colours };
    } catch (error) {
        console.error("Error loading game meta:", error);
    }
}
