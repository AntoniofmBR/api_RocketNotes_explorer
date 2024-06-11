const { Router } = require('express')

const NotesController = require('../controllers/notesController')
const ensureAuthenticated = require('../middleware/ensureAuthenticated')


const notesRoutes = Router()

const notesController = new NotesController()

notesRoutes.use(ensureAuthenticated)

notesRoutes.post('/', notesController.create) //! create note
notesRoutes.get('/:id', notesController.show) //! show note
notesRoutes.get('/', notesController.list) //! list all user notes 
notesRoutes.delete('/:id', notesController.delete) //! delete note


module.exports = notesRoutes