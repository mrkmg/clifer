import {createStreamBeans, toHuman} from "streambeans";

export async function connectStreams(inStream, outStream) {
    return new Promise(resolve => {
        const beans = createStreamBeans(inStream, outStream);
        const interval = setInterval(() => {
            process.stderr.clearLine();
            process.stderr.cursorTo(0);
            process.stderr.write(`A:${toHuman(beans.averageSpeed)}/s | O:${toHuman(beans.overallSpeed)}/s | T:${toHuman(beans.totalBytes)}`);
        }, 1000);

        inStream.on("close", () => {
            clearInterval(interval);
            resolve();
        });
    });
}
