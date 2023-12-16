import * as net from "net";
import * as readline from "readline";
import {Callback, Input} from './common'

/**
 * Start the server
 *
 * # Contract:
 *
 * - Receive: [JSON line (in UTF-8)]\n
 * - Response: [Data Length (u32LE)][Image Data]
 *
 * JSON format: {@link Input}
 *
 * e.g. `"内容"`
 *
 * # Notes
 * If the input content is invalid (e.g. not a String JSON), this line will
 * be ignored silently
 * @param port
 * @param requestData
 */
export function start(port: number, requestData: Callback) {
    const server = net.createServer((socket) => {
        console.log(`Connected: ${socket}`)
        const rl = readline.createInterface({
            input: socket,
        });

        rl.on('line', async (line) => {
            console.log(`on line: ${line}`);
            try {
                const input: Input = JSON.parse(line);
                const imageData = await requestData(input);
                const dataLengthBuffer = Buffer.alloc(4);
                dataLengthBuffer.writeUInt32LE(imageData.length, 0);

                // Sending [Data Length (u32)][Image Data]
                socket.write(Buffer.concat([dataLengthBuffer, imageData]));
            } catch (error) {
                // Ignore invalid JSON lines
                console.error(`Error processing line: ${error.message}`);
            }
        });

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
