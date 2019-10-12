const apiRouts = require("express").Router()

const {documentRouter} = require('./router')

apiRouts.all("/", (req, res) => {
  res.redirect("/documents")
})

apiRouts.use("/documents", documentRouter)

module.exports = apiRouts
