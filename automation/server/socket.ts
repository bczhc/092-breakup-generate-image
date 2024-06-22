import * as net from "net";
import {Callback} from './common'

/**
 * Start the server
 *
 * # Contract:
 *
 * - Request: [Length of `AppName`][AppName][Length of `Params`][Params]
 * - Response: [Length of the image][Image Data]
 *
 * # Notes
 *
 * All length values are in U32LE format.
 * @param port
 * @param requestData
 */
export function start(port: number, requestData: Callback) {
    const server = net.createServer((socket) => {

        let savedData = [];
        let totalLength = -1;
        let appNameLength = -1, paramsLength = -1;

        socket.on('data', async data => {
            try {
                let dataArray = Array.from(data);
                console.log(dataArray);
                savedData.push(...dataArray);

                if (totalLength == -1 && savedData.length >= 8) {
                    // length info is done; get the size of the whole request
                    let buffer = Buffer.from(savedData);
                    appNameLength = buffer.readInt32LE();
                    paramsLength = buffer.readInt32LE(4);
                    totalLength = appNameLength + paramsLength + 4 * 2;
                }

                if (totalLength != -1 && savedData.length >= totalLength) {
                    // the input has been fully collected
                    let start = savedData.slice(4 * 2);
                    let appName = new TextDecoder().decode(new Uint8Array(start.slice(0, appNameLength)));
                    let params = new TextDecoder().decode(new Uint8Array(start.slice(appNameLength, appNameLength + paramsLength)));
                    console.log(`Request: ${appName}, ${params}`);

                    let imageData = await requestData(appName, params);
                    const dataLengthBuffer = Buffer.alloc(4);
                    dataLengthBuffer.writeUInt32LE(imageData.length, 0);
                    socket.write(Buffer.concat([dataLengthBuffer, imageData]));
                }
            } catch (error) {
                // Ignore invalid JSON lines
                console.error(`Error processing line: ${error.message}`);
            }
        })

        // Add 'end' event listener
        socket.on('end', () => {
            console.log('Client disconnected');
        });
    });

    // Add 'error' event listener
    server.on('error', (err) => {
        console.error('Server error:', err.message);
    });

    server.listen(port, '0.0.0.0')
    console.log(`Server started on port ${port}`)
}
