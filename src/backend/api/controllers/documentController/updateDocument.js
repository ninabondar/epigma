const { Document } = require("../../../db")
const ControllerError = require("../../errors/ControllerError")

module.exports = async (req, res) => {
  try {
    const { document_id } = req.params
    const { title = '', shapes = '' } = req.body // TODO remove default

    const doc = await Document.findById(document_id).exec()

    doc.title = title
    doc.shapes = shapes
    doc.updatedAt = new Date()

    await doc.save(err => {
      if (err) {
        throw new ControllerError(err.message, err.status, 'Update Document')
      }
      res.send(doc)
    })
  } catch (err) {
    res.status(503).send({ error: err.message })
  }
}
