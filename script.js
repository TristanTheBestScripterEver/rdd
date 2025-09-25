// script.js

function buildUrl(action) {
    const binaryType = document.getElementById("binaryType").value;
    const channel = document.getElementById("channelName").value || "LIVE";
    const versionHash = document.getElementById("versionHash").value;
    const compress = document.getElementById("compress").checked;
    const zipLevel = document.getElementById("zipLevel").value || 5;

    let baseUrl = "https://rdd.latte.to";
    let url = baseUrl + "/";

    // Decide which endpoint to use
    if (action === "latest") url += "latest";
    if (action === "previous") url += "previous";

    url += "?channel=" + encodeURIComponent(channel) +
           "&binaryType=" + encodeURIComponent(binaryType);

    if (versionHash && action === "hash") {
        url += "&version=" + encodeURIComponent(versionHash);
    }

    if (compress) {
        url += "&zipLevel=" + encodeURIComponent(zipLevel);
    }

    return url;
}

function download(action) {
    const url = buildUrl(action);

    if (action === "hash" && !document.getElementById("versionHash").value) {
        alert("Please enter a Version Hash to download.");
        return;
    }

    window.location.href = url; // triggers browser download
}

function copyLink() {
    const url = buildUrl("hash");
    navigator.clipboard.writeText(url).then(() => {
        alert("Permanent link copied:\n" + url);
    });
}
