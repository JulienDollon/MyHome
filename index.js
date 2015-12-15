exports.handler = function (event, context) {
    try {
        var app = new Application(context, event.session);
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.session.new) {
            app.SessionStarted({requestId: event.request.requestId});
        }
        if (event.request.type === "LaunchRequest") {
            app.Launch(event.request);
        } else if (event.request.type === "IntentRequest") {
            app.Intent(event.request);
        } else if (event.request.type === "SessionEndedRequest") {
            app.SessionEnded(event.request);
            context.succeed();
        }
    } catch (e) {
        console.log("General exception: " + e + e.stack);
        context.fail("Exception: " + e);
    }
};


var Application = (function () {
    function Application(context, session) {
        this.context = context;
        this.session = session;
        var nestConfiguration = require('./nest/index');
        this.nestConfig = nestConfiguration.NestConfiguration();
        var speech = require('./speech/index');
        this.speechBuilder = speech.SpeechBuilder();
        this.speechProducer = speech.SpeechProducer(this.context);
        this.intentsCatalog = [];
        this.InitializeIntents();
    }

    Application.prototype.InitializeIntents = function () {
        var kidsRoom = require('./kids_room/index');
        var babySleepsCheckerIntent = kidsRoom.BabySleepsCheckerIntent(this.nestConfig);
        this.intentsCatalog["CheckBabyIntent"] = babySleepsCheckerIntent;
    };

    Application.prototype.SessionStarted = function (sessionStartedRequest) {
        console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId + ", sessionId=" + this.session.sessionId);
    };

    Application.prototype.Launch = function (launchRequest) {
        console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + this.session.sessionId);
        var welcome = require('./welcome/index');
        var welcomeIntent = welcome.WelcomeIntent(undefined);
        welcomeIntent.Execute(this.speechBuilder, this.speechProducer);
    };

    Application.prototype.Intent = function (intentRequest) {
        console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + this.session.sessionId);
        if (!this.intentsCatalog[intentRequest.intent.name]) {
            throw "Intents not initialized";
            return;
        }
        this.intentsCatalog[intentRequest.intent.name].Execute(this.speechBuilder, this.speechProducer);
    };

    Application.prototype.SessionEnded = function (sessionEndedRequest) {
        console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + this.session.sessionId);
    };

    return Application;
})();