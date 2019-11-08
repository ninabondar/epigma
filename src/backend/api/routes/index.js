const { Router } = require("express")
const documentsRouter = require('./documents')

Router.use('/documents', documentsRouter)

module.exports = router