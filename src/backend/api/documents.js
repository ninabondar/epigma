const { Router } = require("express")
const { Document, db } = require("../db")

const documentRoute = new Router()

documentRoute.get("/", (req, res) => {
  Document.find({})
    .exec()
    .then(docs => {
      res.send(docs)
    })
    .catch(err => {
      res.status(404)
      res.send({ error: "Documents not found" })
    })
})
documentRoute.get("/:id", (req, res) => {
  const { id } = req.params

  Document.findOne({ _id: id })
    .exec()
    .then(doc => res.send(doc))
    .catch(err => {
      res.status(404)
      res.send({ error: "Document not found" })
    })
})

documentRoute.post("/", (req, res) => {
  const { body } = req
  const newDoc = new Document(body)

  newDoc.save((err, doc) => {
    if (err) console.error(err)
    res.send(doc)
  })
})

documentRoute.delete("/:_id", (req, res) => {
  const { _id } = req.params

  Document.findByIdAndRemove(_id, { useFindAndModify: false }, (err, doc) => {
    if (err) throw err
    res.send(`removed doc with id: ${_id} from documents database`)
  })
})

documentRoute.put("/:_id", (req, res) => {
  const { _id } = req.params
  const { body } = req
  body._id = body.id
  delete body.id

  Document.findById(_id, (err, doc) => {
    if (err) return err
    doc.title = doc.title === body.title ? doc.title : body.title
    doc.shapes = doc.shapes === body.shapes ? doc.shapes : body.shapes
    doc.updatedAt = body.updatedAt

    doc.save(err => {
      if (err) return err
      res.send(doc)
    })
  })
})

module.exports = documentRoute
