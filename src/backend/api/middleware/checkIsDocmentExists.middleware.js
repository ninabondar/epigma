const { Document } = require("../../db")
const ControllerError = require("../errors/ControllerError") // TODO

module.exports = async (req, res, next) => {
  const { document_id } = req.params
  const document = await Document.findById(document_id).exec()

  if (!document) {
    return next(new ControllerError("Document not found", 404))
  }

  req.document = document
  next()
}
