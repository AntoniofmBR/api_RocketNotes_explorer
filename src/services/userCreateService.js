const { hash } = require('bcryptjs')

const AppError = require("../utils/appError")

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, password }) {
    const checkUserExists = await this.userRepository.findByEmail(email)

    if(checkUserExists) {
      throw new AppError('Este e-mail já está em uso')
    }

    const hashPassword = await hash(password, 8)

    const user = await this.userRepository.create({ name, email, password: hashPassword })

    return user
  }
}

module.exports = UserCreateService