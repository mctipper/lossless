export async function loadGameMeta(page) {
    try {
        const base = `${page}/data`;

        const [aboutRes, coloursRes] = await Promise.all([
            fetch(`${base}/about.json`),
            fetch(`${base}/colours.json`)
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
