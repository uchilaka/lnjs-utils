function buildEndpoint() {
    console.log('Port -> ', process.env.PORT, '; App Endpoint -> ', process.env.APP_ENDPOINT);
    if (
        [80, 443, 3031].indexOf(process.env.PORT) > -1
        || /^(80|443|3031)$/.test(process.env.PORT)
        || /^https\:\/\//.test(process.env.APP_ENDPOINT)
    )
        return process.env.APP_ENDPOINT;
    else
        return [(process.env.APP_ENDPOINT || 'http://localhost'), ':', process.env.PORT].join('');
}

var EndpointKit = {
    // @TODO depracate 
    URL: buildEndpoint(),
    getURL: buildEndpoint,
    // middlewares
    saveCheckpoint: function (req, res, next) {
        res.cookie('lastCheckpoint', req.originalUrl);
        next();
    },
    getCheckpoint: function (req, res, next) {
        req.lastCheckpoint = req.cookies.lastCheckpoint;
        //EndpointKit.clearCheckpoint(req, res, next);
        next();
    },
    clearCheckpoint: function (req, res, next) {
        res.cookie('lastCheckpoint', null);
        next();
    }
};

module.exports = EndpointKit;