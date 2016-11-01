var oauth2 = require('../auth/oauth2')
    , useragent = require('express-useragent')
    , path = require('path')
    , libs = path.join(process.cwd(), 'libs')
    , config = require(path.join(libs, 'config'))
    , filter = require('array-query')
    ;

module.exports = function () {

    var Client = require('../model/client'),
        endpoint = require('../utils/endpoint');

    return {
        /** To prepare checkpoint, call this middleware AFTER endpoint.getCheckpoint */
        resolveLandingPage: function (req, res, next) {
            console.log('Extracted checkpoint (if available) -> ', req.lastCheckpoint);
            var landingUrl = req.lastCheckpoint;
            // if not set yet, try to get from cookies
            if (!landingUrl && req.cookies)
                landingUrl = req.cookies.lastCheckpoint;
            // if ssoMobile, handle that
            console.log('Cookies? -> ', req.cookies);
            if (req.cookies && req.cookies.ssoMobile && !/j\:null/.test(req.cookies.ssoMobile)) {
                landingUrl = '/';
                res.cookie('ssoMobile', null);
            } /*else if(req.user) {
                landingUrl = req.lastCheckpoint || '/dashboard';
            } */ else {
                landingUrl = landingUrl || '/dashboard';
            }
            // clear checkpoint
            res.cookie('lastCheckpoint', null);
            // log langing url
            console.log('Resolved landing URL to -> ', landingUrl);
            req.landingUrl = landingUrl;
            next();
        },
        checkpoint: function (req, res, next) {
            // if user is authenticated in the session, call the next() to call the next request handler 
            // Passport adds this method to request object. A middleware is allowed to add properties to
            // request and response objects
            // console.log('Request => ', req);
            if (req.isAuthenticated())
                // return next();
                return next();
            else {
                // if the user is not authenticated then redirect him to the login page
                // res.redirect('/');
                var errorMessage = 'You must be authorized to access ' + JSON.stringify(req.originalUrl);
                // @requires ../security/apiRequestWrapper in request callback stack BEFORE checkpoint.js callback to set thisIsAnApiRequest=TRUE
                if (req.thisIsAnApiRequest || /^\/api/.test(req.originalUrl)) {
                    res.statusCode = 401;
                    res.json({ error: errorMessage });
                } else {
                    res.redirect('/');
                }
            }
        },
        getOrCreateAccessToken: function (req, res, next) {
            // @TODO make sure token is NOT expired
            var source = req.headers['user-agent'],
                ua = useragent.parse(source),
                tokenData;
            if (!req.user) {
                /* @INCOMPLETE
                    // create guest user 
    
                    // find guest client
                    Client.findOne({ clientId: 'guest' }, function(err, guest) {
                        if(!guest)
                            return next();
                        // found guest account!
                        tokenData = {
                            clientId: 'guest',
                            userId: ''
                        };
                    });
                    */
                return next();
            } else {
                console.log('Inferred user agent -> ', ua);
                // test user agent for request source
                if (ua.isDesktop) {
                    // assume web access - get web client
                    tokenData = {
                        clientId: 'web',
                        userId: req.user._id.toString()
                    };
                } else if (ua.isAndroid) {
                    tokenData = {
                        clientId: 'android',
                        userId: req.user._id.toString()
                    }
                } else {
                    tokenData = {
                        clientId: 'web',
                        userId: req.user._id.toString()
                    };
                }
            }
            // res.cookie('accessToken', {tokenHere})
            if (!tokenData)
                return next();
            // get token life
            tokenData.expiresIn = /^guest$/i.test(tokenData.clientId) ? config.get('security:guestTokenLife') : config.get('security:tokenLife');
            // generate token
            oauth2.generateTokens(tokenData, function (err, token, refreshToken) {
                console.log('token -> ', token, 'Refresh token -> ', refreshToken);
                res.cookie('oauth', {
                    accessToken: token,
                    refreshToken: refreshToken,
                    expiresIn: tokenData.expiresIn
                });
                next();
            });
        },
        checkIfMultiFactorAuthenticationIsRequired: function (req, res, next) {
            console.log('>> Checking MFA for -> ', req.user.username);
            // @TODO search in spentMFATokens for matching current Session ID
            var matches = filter('sessionId').is(req.cookies.sessId).on(req.user.spentMFATokens);
            if (req.user && req.user.MFA.enabled && !matches.length) {
                if (/^\/api/.test(req.originalUrl)) {
                    // Require authentication, no MFA
                    res.status(401);
                } else {
                    // re-direct to MFA authentication
                    return res.redirect('/secure#!/mfa/verify');
                }
            }
            next();
        }
    }

};
