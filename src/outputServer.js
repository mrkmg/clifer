import {createServer} from "net";
import {EventEmitter} from "events";
import {createStreamBeans, toHuman} from "streambeans";

export class OutputServer extends EventEmitter {
    constructor(inStream, port) {
        super();

        this.inStream        = inStream;
        this.port            = port;
        this.clientConnected = false;
        this.server          = createServer((c) => this.clientConnection(c));
        this.beansTimer = null;
        this.server.listen(this.port);
        this.open = true;
        this.lastSpeed = 0;
    }

    clientConnection(client) {
        if (this.clientConnected) {
            client.end("Already Connected");
            return;
        }

        this.once("close", () => {
            client.end();
            console.log("sent end");
        });

        this.clientConnected = true;

        const beans = createStreamBeans(this.inStream, client);
        beans.averageTimeFrame = 5;
        this.beansTimer = setInterval(() => this.speed(beans.averageSpeed), 1000);

        this.started();

        client.on("end", () => {
            this.complete();
        });
        client.on("error", (e) => {
            this.errored(e);
        });
    }

    speed(speed) {
        if (speed !== this.lastSpeed) {
            this.emit("speed", toHuman(speed));
            this.lastSpeed = speed;
        }
    }

    close() {
        this.emit("close");
        if (this.open) {
            this.open = false;
            this.server.close(() => this.emit("closed"));
            clearInterval(this.beansTimer);
        }
    }

    started() {
        this.emit("started");
    }

    complete() {
        this.emit("complete");
        this.close();
    }

    errored(err) {
        this.emit("error", err);
        this.close();
    }
}
