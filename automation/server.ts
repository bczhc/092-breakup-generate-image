import * as rl from 'readline'
import * as net from "net";

interface Command {
    text: string,
    path: string,
}

export function start(commandCallback: (command: Command) => Promise<void>) {
    let server = net.createServer(async socket => {
        socket.write('Input a line:\n')
        let line = await waitLine(socket);
        let command: [string, string]
        try {
            let parsed = JSON.parse(line);
            if (Array.isArray(parsed) && parsed.length == 2
                && typeof parsed[0] == 'string'
                && typeof parsed[1] == 'string') {
                command = parsed as [string, string]
            } else {
                // noinspection ExceptionCaughtLocallyJS
                throw 'Invalid command; expect [string, string]'
            }
        } catch (e) {
            socket.write(`JSON error: ${e}\n`)
            socket.destroy()
            return
        }

        console.log(`Command: ${command}`)
        let text = command[0]
        let path = command[1]
        commandCallback({
            text: text,
            path: path,
        }).then(() => {
            socket.write('Done!\n')
            socket.destroy()
        })
    })

    server.on('data', data => {
        console.log(data);
    })

    let port = 8081;
    server.listen(port, '0.0.0.0')
    console.log(`Server started on port ${port}`)
}

async function waitLine(socket: net.Socket): Promise<string> {
    return new Promise(r => {
        rl.createInterface(socket, null).on('line', line => {
            r(line)
        })
    })
}
