const csv = require('csv-parser')
const { S3 } = require('aws-sdk')
const s3 = new S3()

const buildBinMessage = require('./helpers/buildBinMessage')
const C = require('./constants')

const log = console.log
const today = Date.now()

const allNextBinDetails = []

s3.getObject(C.s3Params).createReadStream()
    .on('error', (error) => {
      log(error)
    })

    .pipe(csv(C.binHeaders))
    .on('data', (row) => {
      const binDate = Date.parse(row.Date.trim())
      if (binDate > today) allNextBinDetails.push(row)
    })

    .on('end', () => {
      const nextBinMessage = buildBinMessage(allNextBinDetails[0])
      log(nextBinMessage)
    })