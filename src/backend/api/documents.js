const { Router } = require("express")

const { Document, db } = require("../db")
const { documentController } = require("../api/controllers")

const documentRoute = new Router()

documentRoute
  .get("/", documentController.getDocuments)
  .get("/:id", documentController.getDocById)
  .post("/", documentController.createDocument())

  .delete("/:id", async (req, res) => {
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
