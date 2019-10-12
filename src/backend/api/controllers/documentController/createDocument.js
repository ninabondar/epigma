const { Document } = require("../../../db")

module.exports = async (req, res) => {
  const { body } = req
  const newDoc = new Document({
    ...body,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  await newDoc.save((err, doc) => {
    if (err) console.error(err)
    res.send(doc)
  })
}
