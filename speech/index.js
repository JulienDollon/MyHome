module.exports = {
  SpeechProducer: function(context) {
      return {
          Speak: function(serializedSpeech) {
              context.succeed(serializedSpeech);
          }
      };
  },
  SpeechBuilder: function () {
      return {
          Build : function(text, rePromptedText, shouldEndSession) {
              var response = {
                outputSpeech: {
                    type: "PlainText",
                    text: text
                },
                card: {
                    type: "Simple",
                    title: "SessionSpeechlet - MyHome",
                    content: "SessionSpeechlet - " + text
                },
                reprompt: {
                    outputSpeech: {
                        type: "PlainText",
                        text: rePromptedText
                    }
                },
                shouldEndSession: shouldEndSession
            };
            return {
                version: "1.0",
                sessionAttributes: {},
                response: response
            };
          }
      };
  }
};