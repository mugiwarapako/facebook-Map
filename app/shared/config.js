"use strict";
var application = require("application-settings");
var Config = (function () {
    function Config() {
    }
    Config.apiUrl = application.getString("apiUrl", "http://192.168.15.14:8080/fashion/");
    Config.nodeUrl = application.getString("nodeUrl", "http://192.168.15.14:3000");
    Config.appKey = application.getString("appKey", "kid_HyHoT_REf");
    Config.authHeader = application.getString("authHeader", "Basic a2lkX0h5SG9UX1JFZjo1MTkxMDJlZWFhMzQ0MzMyODFjN2MyODM3MGQ5OTIzMQ");
    Config.token = application.getString("token", "");
    Config.type = application.getString("type", "");
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=data:a