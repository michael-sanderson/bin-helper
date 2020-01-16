module.exports = (
    buildBinMessage,
    C,
    csv,
    log,
    s3,
  ) => async () => {
      const getNextDate = () => {
        const today = Date.now()
    
      return new Promise((resolve, reject) => {
        const readStream = s3.getObject(C.s3Params).createReadStream()
        .on('error', error => {
          log(error)
          reject(error)
        })
      .pipe(csv(C.binHeaders))
      .on('data', row => {
        const binDate = Date.parse(row.Date.trim())
        if (binDate > today)  {
          log(C.foundMessage)
          readStream.destroy()
          resolve(buildBinMessage(row))
        }
      })
      .on('end', () => {
        log(C.notFoundMessage)
        resolve(null)
        })
      })
    }
    return await getNextDate()
  }