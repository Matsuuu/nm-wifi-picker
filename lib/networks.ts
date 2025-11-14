import { exec, ExecException } from "child_process";
import { startLoadingAnimation, stopLoadingAnimation } from "./util/loading";

export interface Network {
    inUse: boolean;
    bssid: string;
    ssid: string;
    mode: string;
    channel: string;
    rate: string;
    signal: string;
    bars: string;
    security: string;
    toString(): string;
}

export type NetworkScanResult =
    | { success: true; result: Network[] } //
    | { success: false; error: ExecException };

export function getWifiNetworks(): Promise<NetworkScanResult> {
    return new Promise((resolve, reject) => {
        startLoadingAnimation();
        exec(`nmcli dev wifi`, { encoding: "utf8" }, (err, out) => {
            stopLoadingAnimation();
            if (!err) {
                resolve({
                    success: true,
                    result: parseNmcliTable(out),
                });
                return;
            }
            reject({
                success: false,
                error: err,
            });
        });
    });
}

// Thx chatgpt
export function parseNmcliTable(text: string): Network[] {
    const lines = text.split("\n");

    // remove header
    lines.shift();

    const results: Network[] = [];

    for (let line of lines) {
        // Normalize spacing by collapsing to single spaces
        const parts = line.replace(/\s+/g, " ").trim().split(" ");

        // IN-USE marker handling
        let inUse = false;
        if (parts[0] === "*") {
            inUse = true;
            parts.shift();
        }

        const bssid = parts.shift();
        const modeIndex = parts.indexOf("Infra");

        // SSID is everything from after BSSID until MODE
        const ssid = parts.slice(0, modeIndex).join(" ");

        const mode = parts[modeIndex];
        const channel = parts[modeIndex + 1];
        const rate = parts[modeIndex + 2] + " " + parts[modeIndex + 3]; // "<number> Mbit/s"
        const signal = parts[modeIndex + 4];
        const bars = parts[modeIndex + 5];
        const security = parts.slice(modeIndex + 6).join(" ");

        results.push({
            inUse,
            bssid,
            ssid,
            mode,
            channel,
            rate,
            signal,
            bars,
            security,
            toString() {
                return `${ssid.substring(0, 20).padEnd(20, " ")}\t\
Channel: ${channel.padEnd(4, "")}\t\
${`(${rate})`.substring(0, 14).padEnd(14, " ")}\t\
Signal: ${signal.padEnd(3, " ")} ${bars}`;
            },
        });
    }

    const namedResults = results
        .filter(result => result.ssid !== "--" && result.ssid.length > 0)
        .sort((a, b) => a.ssid.localeCompare(b.ssid));

    return namedResults;
}
