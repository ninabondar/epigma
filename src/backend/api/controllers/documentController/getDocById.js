module.exports = async (req, res) => {
  try {
    const document = req.document

    res.send(document)
  } catch (err) {
    res.status(err.status).send({ error: "Document not found" })
  }
}
