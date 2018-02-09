import yargs from "yargs";

export const opts = yargs
    .options({
        receive: {
            alias: "r",
        },
        file: {
            alias: "f",
            default: "-"
        },
        host: {
            alias: "h",
            default: "clifer.microapp.co"
        },
        port: {
            alias: "p",
            default: 8000
        }
    })
    .help("help")
    .usage("clifer [-h host] [-p port] [-r code] [-f FILE]\n\nSend/or receive a file. If FILE is omitted, STDIN/STDOUT will be used instead.")
    .argv;
