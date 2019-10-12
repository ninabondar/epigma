const { Document } = require("../../../db")

module.exports = async (req, res) => {
  const { id } = req.params

  try {
    const doc = await Document.findById(id).exec()
    res.send(doc)
  } catch (err) {
    res.status(404)
    res.send({ error: "Document not found" })
  }
}
