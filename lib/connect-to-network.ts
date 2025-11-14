import { exec } from "child_process";
import { Network } from "./networks";
import { startLoadingAnimation, stopLoadingAnimation } from "./util/loading";
import chalk from "chalk";

export type NetworkConnectionResult =
    | { success: true; output: string } //
    | { success: false };

export function connectToNetwork(network: Network): Promise<NetworkConnectionResult> {
    console.log("Connecting to " + chalk.green(network.ssid));
    startLoadingAnimation();
    return new Promise((resolve, reject) => {
        exec(
            `nmcli dev wifi connect ${network.ssid.replaceAll(" ", "\\ ")}`,
            { encoding: "utf8" },
            (err, out, stdErr) => {
                stopLoadingAnimation();
                if (!err) {
                    resolve({ success: true, output: out });
                    return;
                }
                reject({ success: false });
            },
        );
    });
}
