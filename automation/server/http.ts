import * as http from 'http';
import {Callback} from "./common";

/**
 * Start an HTTP server that listens for requests on a specific endpoint.
 *
 * @param {number} port - The port number on which the server should listen.
 * @param {Function} requestData - A callback function that retrieves image data.
 */
export function start(port: number, requestData: Callback) {
    const server = http.createServer(async (req, res) => {
        // Parse the request URL
        const {url} = req;

        // Parse the query parameters
        const queryParams = new URLSearchParams(url.split('?')[1]);
        const text = queryParams.get('text');
        console.log(`text: ${text}`)

        if (text) {
            // Call the requestData callback to get image data based on the text parameter
            let imageData = await requestData(text);

            // Set response headers
            res.writeHead(200, {
                'Content-Type': 'image/png', // Adjust the content type based on your image format
                'Content-Length': Buffer.byteLength(imageData, 'utf-8'),
            });

            // Send the image data as the response body
            res.end(imageData);
        } else {
            // Handle missing text parameter
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Bad Request: Missing "text" parameter');
        }
    });

    // Start listening on the specified port
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}
