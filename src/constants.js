module.exports = {
    binHeaders: ['Date', 'Colour', 'Type'],
    cancelIntent: 'AMAZON.CancelIntent',
    enableRemindersMessage: 'Please enable reminders permissions in the Amazon Alexa app',
    foundMessage: 'Found next bin details',
    genericErrorMessage: 'Sorry, I can\'t understand the command. Please say again.',
    goodbyeMessage: 'Goodbye!',
    helpIntent: 'AMAZON.HelpIntent',
    helpMessage: 'You can ask me what bin to put out by saying "Alexa, which bin".',
    intentRequest: 'IntentRequest',
    launchRequest: 'LaunchRequest',
    notFoundMessage: 'Operation finished with no results found.',
    reminderMessage: 'I can remind you each week which bin to put out. Would you like to set a weekly reminder?',
    reminderError: "There was an error creating your reminder. Please let the skill publisher know.",
    reminderSetMessage: "A reminder has been set to tell you what bin to put out every Monday at 8pm",
    s3Params: { Bucket: process.env.bucketName, Key: process.env.bucketObjectKey},
    sessionEndRequest: 'SessionEndedRequest',
    stopIntent: 'AMAZON.StopIntent',
    whichBinIntent: 'WhichBinIntent',
    yesIntent: "AMAZON.YesIntent"
}