var applicationModule = require("application");
var application = require("tns-core-modules/application");
var nativescript_facebook_1 = require("nativescript-facebook");

application.on(application.launchEvent, function (args) {
    nativescript_facebook_1.init("1771472059772879", nativescript_facebook_1.LoginBehavior.LoginBehaviorWeb);
});

application.run({ moduleName: "app-root" });

