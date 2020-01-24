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
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
  )
  .withApiClient(new Alexa.DefaultApiClient())
  .addErrorHandlers(ErrorHandler)
  .lambda()