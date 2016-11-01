var path = require('path')
    , libs = path.join(process.cwd(), 'libs')
    , endpoint = require(path.join(libs, 'utils', 'endpoint'))
    ;

module.exports = function (req, res, next) {
    if (/^\/api\//.test(req.originalUrl)) {
        if (!Array.isArray(res.errors))
            res.errors = {
                log: []
            };
        // prepare payload
        if (typeof req.payload !== 'object') {
            res.payload = {
                errors: res.errors,
                // prepare userinfo if available 
                person: req.user ? req.user : null
            };
            console.log('Init payload for: ', req.originalUrl);
        }
    } else if (!/^\/(stylesheets|javascripts|bower)\/?/.test(req.originalUrl)) {
        console.log('Matched authenticated view -> ', req.originalUrl);
        res.payload = {
            baseURL: endpoint.getURL(),
            person: req.user,
            credentials: (req.cookies && req.user) ? req.cookies.oauth : {}
        };
    }
    next();
};