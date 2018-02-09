import {createConnection, createServer} from "net";
import {connectStreams} from "./connectStreams";

export async function send(host, port, fileStream) {
    const sendDetails = await getSendDetails(host, port);


    if ("error" in sendDetails) {
        console.error(data.error);
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Pause 1 seconds

    console.log(`Send Code: ${sendDetails.code}`);

    try {
        await setupSendServer(sendDetails.localAddress, sendDetails.localPort, fileStream);
        console.error("\nTransfer Complete");
    } catch (e) {
        if ("code" in e && e.code === "ECONNRESET") {
            console.error("\nConnection lost during transfer.");
        } else {
            throw e;
        }
    }
}

async function setupSendServer(host, port, filestream) {
    return new Promise((resolve, reject) => {
        const server = createServer(s => {
            console.log("Receiver Connected. Sending File.");
            connectStreams(filestream, s).then(() => {
                server.close();
                resolve();
            });
            s.on("error", (e) => {
                filestream.destroy();
                reject(e);
            });
        });

        server.on("error", reject);

        server.listen(port, host);
    });

}

async function getSendDetails(host, port) {
    return new Promise((resolve, reject) => {
        const initialConnection = createConnection({host, port}, () => {
            const localAddress = initialConnection.localAddress;
            const localPort = initialConnection.localPort;

            initialConnection.write(JSON.stringify({action: "send", localAddress, localPort}));
            initialConnection.once("data", (d) => {
                const code = JSON.parse(d).code;
                initialConnection.on("close", () => {
                    resolve({code, localAddress, localPort})
                });
                initialConnection.end();
            });
        });
        initialConnection.on("error", reject);
    });
}
