const { Router } = require("express")
const { Document, db } = require("../db")

const documentRoute = new Router()

documentRoute
  .get("/", async (req, res) => {
    try {
      const docs = await Document.find({}).exec()

      res.send(docs)
    } catch (err) {
      res.status(404)
      res.send({ error: "Documents not found" })
    }
  })
  .get("/:id", async (req, res) => {
    const { id } = req.params

    try {
      const doc = await Document.findById(id).exec()
      res.send(doc)
    } catch (err) {
      res.status(404)
      res.send({ error: "Document not found" })
    }
  })

  .post("/", (req, res) => {
    const { body } = req
    const newDoc = new Document({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    newDoc.save((err, doc) => {
      if (err) console.error(err)
      res.send(doc)
    })
  })

  .delete("/:id", (req, res) => {
    const { id } = req.params

    Document.findByIdAndRemove(id, { useFindAndModify: false }, (err, doc) => {
      if (err) throw err
      res.send({
        status: "ok",
        message: `removed doc with id: ${id} from documents database`
      })
    })
  })

  .put("/:id", async (req, res) => {
    const { id } = req.params
    const { body } = req

    try {
      const doc = await Document.findById(id).exec()

      doc.title = body.title
      doc.shapes = body.shapes
      doc.updatedAt = new Date()

      doc.save(err => {
        if (err) return err
        res.send(doc)
      })
    } catch (err) {
      res.status(503)
      res.send({ error: "Something went wrong" })
    }
  })

module.exports = documentRoute
