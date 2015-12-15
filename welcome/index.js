module.exports = {
  WelcomeIntent: function () {
      return {
          Execute : function(speechBuilder, speechProducer) {
              var speech = speechBuilder.Build("Welcome to the Dollon's home!", "Ask me things about your home, camera, lights, doors, wifi or check the baby", false);
              speechProducer.Speak(speech);
          }
      };
  }
};