export let createAbsoluteUrl = (url) => {
    console.log("URL:       " + url);
    url = !url || url.startsWith("data:") || url.startsWith("https:") || url.startsWith("http:") ? url : `app://${url}`;
    console.log("CONVERTED: " + url);
    return url;
}