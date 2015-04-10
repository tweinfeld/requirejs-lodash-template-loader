define(["lodash", "text"], function (_, text) {

    "use strict";

    var buildMap = {};

    var persist = function (moduleName) {
        return function (payload) {
            return buildMap[moduleName] = payload;
        }
    };

    var defineTemplate = _.template("define(\"<%-name%>\", function(){ return <%=content%> })");

    return {
        load: function (name, req, onLoadNative, config) {
            text.load(name, req, _.extend(_.flow(_.template, config.isBuild ? persist(name) : _.identity, onLoadNative), _.pick(onLoadNative, 'error')), config);
        },
        write: function (pluginName, moduleName, write) {
            buildMap[moduleName] && write(defineTemplate({
                "name": [pluginName, moduleName].join('!'),
                "content": buildMap[moduleName].toString()
            }));
        }
    };
});