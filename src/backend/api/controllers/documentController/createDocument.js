const { Document } = require("../../../db")
const ControllerError = require("../../errors/ControllerError") // TODO

module.exports = async (req, res) => {
  try {
    const { body } = req
    const newDoc = new Document({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await newDoc.save((err, doc) => {
      if (err) console.error(err) //TODO handler
      res.send(doc)
    });

  } catch (err) {
    res.json(err.message)
  }
}
