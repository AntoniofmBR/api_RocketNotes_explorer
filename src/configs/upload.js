const path = require('path')
const multer = require('multer')
const crypto = require('crypto')

const tmp_folder = path.resolve(__dirname, '..', '..', 'tmp')
const uploads_folder = path.resolve(tmp_folder, 'uploads')

const MULTER = {
  storage: multer.diskStorage({
    destination: tmp_folder,
    filename(req, file, callback){
      const fileHash = crypto.randomBytes(10).toString('hex')
      const fileName = `${fileHash}-${file.originalname}`

      return callback(null, fileName)
    },
  })
}

module.exports = {
  tmp_folder,
  uploads_folder,
  MULTER
}