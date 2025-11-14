import { select } from "@inquirer/prompts";
import { exit } from "process";
import { getWifiNetworks } from "./lib/networks";
import { connectToNetwork } from "./lib/connect-to-network";
import chalk from "chalk";

console.log("Scanning for wifi networks...");

process.on("uncaughtException", error => {
    if (error instanceof Error && error.name === "ExitPromptError") {
        console.log("👋 until next time!");
    } else {
        // Rethrow unknown errors
        throw error;
    }
});

process.on("SIGINT", () => {
    console.log("\n\n👋 until next time!");
    exit(1);
});

const scanResult = await getWifiNetworks();
if (scanResult.success === false) {
    console.log(scanResult.error);
    exit(1);
}

const networks = scanResult.result;

const choice = await select({
    message: "Select network to connect to",
    choices: networks.map((net, i) => ({
        name: net.toString(),
        value: i,
    })),
});

const network = networks[choice];

connectToNetwork(network);

console.log(chalk.blue("All done. See ya next time! 👋 "));
