var path = require('path')
    , endpoint = require('./endpoint')
    ;

module.exports = function (req, res, next) {

    if (res && !res.payload) {
        res.payload = {
            success: false,
            error: null, // Object for capturing specific request error
            errors: {
                log: []
            }, // Object for capturing form errors to be returned in the response
        }
        if (/^\/api\//.test(req.originalUrl)) {
            console.log('Init payload for: ', req.originalUrl);
            if (!Array.isArray(res.errors))
                res.errors = {
                    log: []
                };
            // prepare payload
            if (req.user) {
                res.payload.person = req.user;
            }
        } else if (!/^\/(stylesheets|javascripts|bower)\/?/.test(req.originalUrl)) {
            console.log('Matched authenticated view -> ', req.originalUrl);
            res.payload = {
                baseURL: endpoint.getURL(),
                person: req.user,
                credentials: (req.cookies && req.user) ? req.cookies.oauth : {}
            };
        }
    }

    if (typeof next === 'function')
        next();
};