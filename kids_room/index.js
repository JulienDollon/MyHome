module.exports = {
  BabySleepsCheckerIntent: function (nestConfig) {
      var request = require('request');
      var cameraEndpoint = nestConfig.GetCameraEndpoint();

      var millisToMinutes = function (millis) {
        var minutes = Math.floor(millis / 60000);
        return minutes + " minutes ago";
      };

      var getCameraData = function(callback) {
          request(cameraEndpoint, function (error, response, body) {

            if (error) {
                console.log("Error when getting data from camera: " + error);
                throw error;
            }

            console.log(JSON.stringify(response));
            var camera_data = JSON.parse(body);
            callback(camera_data);
          });
      };

      var getMinimumMinutesBetweenMotions = function () { return 2; };

      var detectMotions = function(camera_data, motionDetectedCallback, motionUndetectedCallback) {
        var last_date = camera_data.last_event.start_time;
        var serializedDate = Date.parse(last_date);
        var diff = Math.abs(new Date() - serializedDate);

        if(diff / 100000 < getMinimumMinutesBetweenMotions()) {
            motionDetectedCallback(millisToMinutes(diff));
        }
        else {
            motionUndetectedCallback();
        }
      };

      return {
          Execute : function(speechBuilder, speechProducer) {
                getCameraData(function(camera_data) {
                    detectMotions(camera_data, function(ellaspedMinutesSinceLastMotion) {
                        var messageToSay = "He is not sleeping. I heard sounds and saw motions " + ellaspedMinutesSinceLastMotion;
                        var speech = speechBuilder.Build(messageToSay, "", true);
                        speechProducer.Speak(speech);
                    }, function() {
                        var speech = speechBuilder.Build("The baby is sleeping well", "", true);
                        speechProducer.Speak(speech);
                    });
                });
          }
      };
  }
};