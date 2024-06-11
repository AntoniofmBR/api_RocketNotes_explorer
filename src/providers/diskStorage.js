const fs = require('fs')
const path = require('path')

const uploadConfig = require('../configs/upload')

class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmp_folder, file),
      path.resolve(uploadConfig.uploads_folder, file),
    )

    return file
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.uploads_folder, file)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }
}

module.exports = DiskStorage