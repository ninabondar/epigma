const documentRoute = require("express").Router()

const { documentController } = require("../controllers");
const { checkIsDocumentExistMiddleware } = require("../middleware");


documentRoute.get("/", documentController.getDocuments);
documentRoute.post("/", documentController.createDocument);

documentRoute.use("/:document_id", checkIsDocumentExistMiddleware);
documentRoute.get("/:document_id", documentController.getDocById);
documentRoute.delete("/:document_id", documentController.deleteDocument);
documentRoute.put("/:document_id", documentController.updateDocument);

module.exports = documentRoute
