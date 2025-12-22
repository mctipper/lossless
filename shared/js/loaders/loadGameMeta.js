export async function loadGameMeta(page) {
    const base = `/${page}/data`;

    const [aboutRes, coloursRes] = await Promise.all([
        fetch(`${base}/about.json`),
        fetch(`${base}/colours.json`)
    ]);

    const about = await aboutRes.json();
    const colours = await coloursRes.json();

    return { about, colours };
}
