import {createConnection} from "net";
import {connectStreams} from "./connectStreams";

export async function receive(intermediaryHost, intermediaryPort, code, fileStream) {
    const data = await getReceiveDetails(intermediaryHost, intermediaryPort, code);

    if ("error" in data) {
        console.error(data.error);
        return;
    }

    let host;
    let port;

    switch (data.action) {
        case "localConnect":
            host = data.details.localAddress;
            port = data.details.localPort;
            break;
        case "remoteConnect":
            host = data.details.address;
            port = data.details.port;
            break;
        default:
            throw new Error("Unknown Command");
    }

    console.error(`Attempting to connect to ${host}:${port}`);

    const senderConnection = createConnection({host, port}, () => {
        connectStreams(senderConnection, fileStream);
    });
    senderConnection.on("error", (e) => {
        if (e.code === "ECONNREFUSED") {
            console.error("Could not connect to peer.");
        } else {
            console.error(e.message);
        }
    });
}

async function getReceiveDetails(host, port, code) {
    return new Promise((resolve, reject) => {
        const initialConnection = createConnection({host, port}, () => {
            initialConnection.write(JSON.stringify({action: "receive", code}));
            initialConnection.once("data", (d) => {
                initialConnection.end();
                const data = JSON.parse(d);
                resolve(data);
            });
            initialConnection.on("error", reject);
        });
    })
}

