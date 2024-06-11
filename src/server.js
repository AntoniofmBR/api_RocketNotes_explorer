require('express-async-errors')
require('dotenv/config')
const express = require('express')
const cors = require('cors')


const migrationsRun = require('./database/sqlite/migrations')
const AppError = require('./utils/appError')
const uploadConfig = require('./configs/upload')

const routes = require('./routes')

migrationsRun()

const app = express()
app.use(cors())
app.use(express.json())

app.use(routes)

app.use('/files', express.static(uploadConfig.uploads_folder))

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  console.error(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})


const port = process.env.SERVER_PORT || 3333
app.listen(port, () => console.log(`Server is running on port ${port} 🚀`))