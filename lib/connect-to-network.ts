import { exec } from "child_process";
import { Network } from "./networks";
import { startLoadingAnimation, stopLoadingAnimation } from "./util/loading";
import chalk from "chalk";

export type NetworkConnectionResult =
    | { success: true } //
    | { success: false };

export function connectToNetwork(network: Network) {
    console.log("Connecting to " + chalk.green(network.ssid));
    startLoadingAnimation();
    return new Promise((resolve, reject) => {
        exec(
            `nmcli dev wifi connect ${network.ssid.replaceAll(" ", "\\ ")}`,
            { encoding: "utf8" },
            (err, out, stdErr) => {
                stopLoadingAnimation();
                console.log({ err, out, stdErr });
                if (!err) {
                    resolve({ success: true });
                    return;
                }
                reject({ success: false });
            },
        );
    });
}
