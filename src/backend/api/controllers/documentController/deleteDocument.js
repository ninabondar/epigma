const { Document } = require("../../../db")
const ControllerError = require("../../errors/ControllerError");


module.exports = async (req, res) => {
  try {
    const { document_id } = req.params

    Document.findByIdAndRemove(document_id, { useFindAndModify: false }, (err, doc) => {
      if (err) {
        throw new ControllerError(err.message, 500, 'DeleteDocument')
      }

      res.send({
        status: "ok",
        message: `removed doc with id: ${document_id} from documents database`
      })
    })
  } catch (e) {
    res.status(e.status).json(e.message)
  }
}
