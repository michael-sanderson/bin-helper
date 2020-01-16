module.exports = (C, getBinResponse) => {
    const LaunchRequestHandler = {
      canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === C.launchRequest
      },
      handle(handlerInput) {
        const speechText = C.welcomeMessage
  
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse()
      }
    }
    //This handler requires the Default Api to be passed in from index and as such doesnt work at present
    const CreateReminderIntentHandler = {
      canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === C.intentRequest
          && handlerInput.requestEnvelope.request.intent.name === C.yesIntent
      },
      async handle(handlerInput) {
        const remindersApiClient = handlerInput.serviceClientFactory.getReminderManagementServiceClient(),
          { permissions } = handlerInput.requestEnvelope.context.System.user
          
        if(!permissions) {
          return handlerInput.responseBuilder
            .speak("Please enable reminders permissions in the Amazon Alexa app")
            .withAskForPermissionsConsentCard(["alexa::alerts:reminders:skill:readwrite"])
            .getResponse()
        }
        try {
          const now = new Date()
          const nextMonday = new Date(now.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7))
          const reminderParams = {
            requestTime : now,
            trigger: {
            type : 'SCHEDULED_ABSOLUTE',
            scheduledTime : new Date(nextMonday.setHours(20,00,00,00)),
            timeZoneId : 'Europe/Belfast',
            recurrence : {                     
              freq : 'WEEKLY',               
              byDay: ['Mo']                 
              }
            },
            alertInfo: {
              spokenInfo: {
                content: [{
                  locale: 'en-US', 
                  text: await getBinResponse()
                }]
              }
            },
            pushNotification : {                            
              status : 'ENABLED'
            }
          }
          await remindersApiClient.createReminder(reminderParams)
          return handlerInput.responseBuilder
            .speak(C.reminderSetMessage)
            .getResponse()
      } catch (error) {
          return handlerInput.responseBuilder
            .speak(C.reminderError)
            .getResponse()
        }
      }
    }
    const WhichBinIntentHandler = {
      canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === C.intentRequest
          && handlerInput.requestEnvelope.request.intent.name === C.whichBinIntent
      },
      async handle(handlerInput) {
        const speechText = await getBinResponse()
  
        return handlerInput.responseBuilder
          .speak(speechText)
          .getResponse()
      }
    }
    const HelpIntentHandler = {
      canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === C.intentRequest
          && handlerInput.requestEnvelope.request.intent.name === C.helpIntent
      },
      handle(handlerInput) {
        const speechText = C.helpMessage
  
        return handlerInput.responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse()
      }
    }
    const CancelAndStopIntentHandler = {
      canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === C.intentRequest
          && (handlerInput.requestEnvelope.request.intent.name === C.cancelIntent
            || handlerInput.requestEnvelope.request.intent.name === C.stopIntent)
      },
      handle(handlerInput) {
        const speechText = C.goodbyeMessage
  
        return handlerInput.responseBuilder
          .speak(speechText)
          .withShouldEndSession(true)
          .getResponse()
      }
    }
    const SessionEndedRequestHandler = {
      canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === C.sessionEndRequest
      },
      handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse()
      }
    }
    const ErrorHandler = {
      canHandle() {
        return true
      },
      handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`)
  
        return handlerInput.responseBuilder
          .speak(C.genericErrorMessage)
          .reprompt(C.genericErrorMessage)
          .getResponse()
      }
    }
    return {
      LaunchRequestHandler,
      CreateReminderIntentHandler,
      WhichBinIntentHandler,
      HelpIntentHandler,
      CancelAndStopIntentHandler,
      SessionEndedRequestHandler,
      ErrorHandler
    }
  }