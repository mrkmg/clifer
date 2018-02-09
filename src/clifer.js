import {createConnection, createServer} from "net";
import {createWriteStream, createReadStream} from "fs";
import {opts} from "./opts";
import {receive} from "./receive";
import {send} from "./send";

main().catch((e) => console.error(e));

async function main() {
    if (opts.receive) {
        let outFileStream;

        if (opts.file === "-") outFileStream = process.stdout;
        else outFileStream = createWriteStream(opts.file);

        return receive(opts.host, opts.port, opts.receive, outFileStream);
    } else {
        let inFileStream;

        if (opts.file === "-") inFileStream = process.stdin;
        else inFileStream = createReadStream(opts.file);

        return send(opts.host, opts.port, inFileStream);
    }
}
