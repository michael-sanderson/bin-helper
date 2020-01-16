const Alexa = require('ask-sdk-core')

const csv = require('csv-parser')

const initGetBinResponse = require('./helpers/getBinResponse')

const buildBinMessage = require('./helpers/buildBinMessage')
const C = require('./constants')
const getHandlers = require('./helpers/getHandlers')
const s3 = require('./aws')

const log = console.log

const getBinResponse = initGetBinResponse(
  buildBinMessage,
  C,
  csv,
  log,
  s3
)

const {
  LaunchRequestHandler,
  CreateReminderIntentHandler,
  WhichBinIntentHandler,
  HelpIntentHandler,
  CancelAndStopIntentHandler,
  SessionEndedRequestHandler,
  ErrorHandler
} = getHandlers(C, getBinResponse)

const skillBuilder = Alexa.SkillBuilders.custom()

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    CreateReminderIntentHandler,
    WhichBinIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  //The below currently doesnt work as new Alexa.DefaultApiClient() returns empty object
  // .withApiClient(new Alexa.DefaultApiClient())
  .lambda()