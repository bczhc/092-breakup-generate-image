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
        let appName = queryParams.get('name');
        let params = queryParams.get('params');
        console.log(`Request: ${appName}, ${params}`);

        if (!!appName && !!params) {
            try {
                // Call the requestData callback to get image data based on the text parameter
                let imageData = await requestData(appName, params);

                // Set response headers
                res.writeHead(200, {
                    'Content-Type': 'image/png', // Adjust the content type based on your image format
                    'Content-Length': Buffer.byteLength(imageData, 'utf-8'),
                });

                // Send the image data as the response body
                res.end(imageData);
            } catch (e) {
                // Internal Error
                res.writeHead(500);
                res.end(`Internal Server Error: ${e}`)
            }
        } else {
            // Handle missing text parameter
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Bad Request: Missing "text" and "params" parameters');
        }
    });

    // Start listening on the specified port
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}
