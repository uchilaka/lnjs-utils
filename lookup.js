module.exports = function() {

    var path=require('path'),
        libs=path.join(process.cwd(), 'libs'),
        User=require(path.join(libs, 'model', 'user')),
        handyUtil=require(path.join(libs, 'utils', 'handy'))
        ;

    var LookupUtils = {
        // done(error: AnyObject, exists: Bool, suggestion: String)
        checkIfUsernameExists: function(testUsername, done) {
            User.find({ username: testUsername }, function(err, user) {
                var suggestion=testUsername, exists = false;
                if(Array.isArray(user) && user.length>0) {
                    exists = true;
                    suggestion=[testUsername, user.length+1].join('_');    
                }
                done(err, exists, suggestion);
            });
        },
        getUniqueUsername: function(req, res, next) {
            var seed=handyUtil.randomUsername();
            var nameIsAvailable=false;
            LookupUtils.checkIfUsernameExists(seed, function(err, exists, suggestion) {
                req.newUsername = suggestion;
                next();
            });
        }
    };

    return LookupUtils;

};