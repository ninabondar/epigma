const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

class API {
  fetchDocument(id) {
    return fetch(API_ENDPOINT + `/documents/${id}`).then(response =>
      response.json()
    )
  }

  saveDocument(id, newDocument) {
    return fetch(API_ENDPOINT + `/documents/${id}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(newDocument)
    })
  }
}

export default new API()
