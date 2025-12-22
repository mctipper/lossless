export function getPageName() {
    const params = new URLSearchParams(window.location.search);
    return params.get("g"); // "dkc2"
}
