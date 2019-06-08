const { Router } = require("express")
const { Document } = require("../db")

const documentRoute = new Router()

documentRoute.get("/", (req, res) => {
  Document.find({})
    .exec()
    .then(doc => res.send(doc))
    .catch(err => {
      res.status(404)
      res.send({ error: "Document not found" })
    })
})

documentRoute.get("/:_id", (req, res) => {
  // take name out of query string
  const { _id } = req.params

  Document.findOne({ _id })
    .exec()
    .then(doc => res.send(doc))
    .catch(err => {
      res.status(404)
      res.send({ error: "Document not found" })
    })
})

module.exports = documentRoute
