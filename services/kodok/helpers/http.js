const urlLib = require('url');
const queryStringLib = require('querystring');

module.exports = {
    parseRequest,
    getRequestBody,
    serveServiceStatus,
}

function parseRequest(request) {
    const { method, headers } = request
    const requestUrl = urlLib.parse(request.url, true);
    const { pathname: requestPath, query: requestQuery } = requestUrl;
    return { method, headers, requestPath, requestQuery };
}

async function getRequestBody(request) {
    return new Promise((resolve, reject) => {
        try {
            let body = '';
            request.on('data', chunk => {
                body += chunk.toString();
            });
            request.on('end', () => {
                try {
                    resolve(queryStringLib.parse(body));
                } catch (error) {
                    logger.error('Error parsing HTTP body: ', body)
                    reject(error);
                }
            });
        } catch (error) {
            reject(error);
        }
    })
}

function serveServiceStatus(_, response, serviceInfo, statusKey, statusLabel) {
    if (serviceInfo.status[statusKey]) {
        response.writeHead(200);
        return response.end(`${serviceInfo.serviceName} is ${statusLabel}`);
    }
    response.writeHead(500);
    return response.end(`${serviceInfo.serviceName} is not ${statusLabel}`);
}