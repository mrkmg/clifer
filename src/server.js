import {createServer} from "net";
import {generate} from "shortid";

const BASE_PORT = "PORT" in process.env ? parseInt(process.env.PORT) : 8000;

const server = createServer(baseConnection);
server.listen(BASE_PORT, baseConnectionListening);

const clients = {};

function baseConnection(connection) {
    const client = {
        connection: connection,
        details: {
            address: connection.remoteAddress.replace("::ffff:", ""),
            port: connection.remotePort,
        }
    };

    connection.on("data", (raw) => {
        try {
            const d = JSON.parse(raw);

            if (!("action" in d)) {
                throw new Error("Missing Action");
            }

            let code;

            switch (d.action) {
                case "send":
                    client.details.localAddress = "localAddress" in d ? d.localAddress : "";
                    client.details.localPort = "localPort" in d ? d.localPort : "";
                    code = generate();
                    connection.end(JSON.stringify({action: "send", code}));
                    clients[code] = client;
                    break;
                case "receive":
                    if (!("code" in d)) {
                        throw new Error("Missing Code");
                    }
                    code = d.code;

                    if (!(code in clients)) {
                        throw new Error("Unknown Code");
                    }

                    const connectionType = clients[code].details.address === client.details.address ? "localConnect" : "remoteConnect";

                    connection.end(JSON.stringify({action: connectionType, details: clients[code].details}));
                    delete clients[code];
                    break;
                default:
                    throw new Error("Unknown Action");
            }
        } catch (e) {
            connection.end(JSON.stringify({error: e.message}));
        }
    });
}

function baseConnectionListening(err) {
    console.log(err ? err : "Listening");
}
