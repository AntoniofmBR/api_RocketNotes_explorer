const AppError = require("../utils/appError")
const sqliteConnection = require('../database/sqlite')
const { hash, compare } = require('bcryptjs')

class UsersController {
  /**
   * index - GET para listar vários registros
   * show - GET para exibir um registro especifico
   * create - POST para criar um registro
   * update - PUT para atualizar um registro
   * delete - DELETE para remover um registro
   */

  async create(req, res) {
    const { name, email, password } = req.body

    const database = await sqliteConnection();
    const checkUserExists = await database.get(`SELECT * FROM users WHERE email = (?)`, [email])

    if(checkUserExists) {
      throw new AppError('Este e-mail já está em uso')
    }

    const hashPassword = await hash(password, 8)

    await database.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashPassword])

    return res.status(201).json()
  }

  async update(req, res) {
    const { name, email, password, oldPassword } = req.body
    const { id } = req.user

    const database = await sqliteConnection()
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

    if(!user) {
     throw new AppError("Usuário não encontrado")
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
     throw new AppError("Este e-mail já está em uso.")
    }

    user.name = name ?? user.name
    user.email= email ?? user.email

    if(password && !oldPassword) {
     throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
    }

    if(password && oldPassword) {
     const checkOldPassword = await compare(oldPassword, user.password)

     if(!checkOldPassword) {
       throw new AppError("A senha antiga não confere.")
     }

     user.password = await hash(password, 8)
    }

    await database.run(`
     UPDATE users SET
     name = ?,
     email = ?,
     password = ?,
     updated_at = DATETIME('now')
     WHERE id = ?`,
     [user.name, user.email, user.password, id]
   )

   return res.status(200).json()
 }
}


module.exports = UsersController
