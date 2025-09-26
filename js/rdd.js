// rdd.js - Fixed version with JSZip integration

// Simple logger
function log(msg) {
    console.log("[RDD] " + msg);
}

// Download helper for binary files
function downloadBinaryFile(name, data, mime) {
    const blob = new Blob([data], { type: mime || "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    log("Downloaded: " + name);
}

// Fetch binary from URL
function requestBinary(url, callback) {
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.arrayBuffer();
        })
        .then(buffer => callback(buffer))
        .catch(err => log("Request failed: " + err));
}

// Extract ZIP using JSZip
async function extractZip(fileName, arrayBuffer, extractRoot) {
    try {
        const zip = await JSZip.loadAsync(arrayBuffer);

        for (const [entryName, entry] of Object.entries(zip.files)) {
            if (entry.dir) continue; // skip folders

            const data = await entry.async("uint8array");
            log(`Extracted ${fileName}/${entryName} → ${extractRoot}${entryName}`);

            // Trigger file download for extracted entry
            downloadBinaryFile(`${extractRoot}${entryName}`, data, "application/octet-stream");
        }
    } catch (e) {
        log("ZIP extraction failed: " + e);
    }
}

// Main download handler
function downloadFile(fileName, url, isZip = false, extractRoot = "") {
    requestBinary(url, async (arrayBuffer) => {
        if (isZip) {
            log("Extracting ZIP: " + fileName);
            await extractZip(fileName, arrayBuffer, extractRoot);
        } else {
            log("Downloading file: " + fileName);
            downloadBinaryFile(fileName, arrayBuffer, "application/octet-stream");
        }
    });
}

// Example usage (hook this into your UI buttons)
// For normal files:
/// downloadFile("RobloxPlayer.exe", "https://example.com/RobloxPlayer.exe");

// For zips:
/// downloadFile("RobloxArchive.zip", "https://example.com/RobloxArchive.zip", true, "Roblox/");
