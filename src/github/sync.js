define([
    "../core",

    "../github",
    "../storage"
], function (radic) {


    radic.github.syncRequest = function (uri) {

        github.transport.async = false;
        var base = github.transport.base;
        github.transport.base = base + uri;
        var responseText = github.transport.send();
        github.transport.async = true;
        github.transport.base = base;
        return responseText;
    };


    radic.github.sync = function (uri, options) {
        options = $.extend({expires: 60, force: false}, options);

        if (options.force === false) {
            var val = radic.storage.get(uri, {
                json: true
            });
            if (val !== null) {
                return val;
            }
        }

        var response = JSON.parse(radic.github.syncRequest(uri));

        radic.storage.set(uri, reponse, {
            json: true,
            expires: options.expires
        });

        return response;
    };
});
