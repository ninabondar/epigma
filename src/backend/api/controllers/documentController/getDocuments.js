const { Document }= require("../../../db")

module.exports = async (req, res) => {
  try {
    const docs = await Document.find().exec()

    res.send(docs)
  } catch (err) {
    res.status(404).send({ error: "Documents not found" })
  }
}
