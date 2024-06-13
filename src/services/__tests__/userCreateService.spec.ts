const UserCreateService = require('../userCreateService')
const UserRepositoryInMemory = require('../../repositories/userRepositoryInMemory')
const AppError = require('../../utils/appError')

describe('User Create Service unit tests', () => {
  let userRepositoryInMemory = null
  let userCreateService = null

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory()
    userCreateService = new UserCreateService(userRepositoryInMemory)
  })
  it('should create a user', async () => {
    const user = {
      name: 'User test',
      email: 'user@email.com',
      password: '123',
    }

    const userCreated = await userCreateService.execute(user)

    expect(userCreated).toHaveProperty('id')
  })

  it('should not create a user with exists email', async () => {
    const user1 = {
      name: 'User test 1',
      email: 'user@email.com',
      password: '123',
    }

    const user2 = {
      name: 'User test 2',
      email: 'user@email.com',
      password: '123',
    }
    
    await userCreateService.execute(user1)
    await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError('Este e-mail já está em uso'))
  })
})
