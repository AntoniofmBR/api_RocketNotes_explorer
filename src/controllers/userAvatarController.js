const knex = require('../database/knex')
const AppError = require('../utils/appError')
const DiskStorage = require('../providers/diskStorage')

class UserAvatarController {
  async update(req, res) {
    const user_id = req.user.id
    const avatarFilename = req.file.filename

    const diskStorage = new DiskStorage()

    const user = await knex('users')
    .where({ id: user_id }).first()

    if(!user) {
      throw new AppError('Apenas usuários autenticados podem se cadastrar', 401)
    }

    if(user.avatar) {
      await diskStorage.deleteFile(user.avatar)
    }

    const fileName = await diskStorage.saveFile(avatarFilename)
    user.avatar = fileName

    await knex('users').update(user).where({ id: user_id })

    return res.json(user)
  }
}

module.exports = UserAvatarController