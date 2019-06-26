const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

class API {
  fetchDocument(id) {
    return fetch(API_ENDPOINT + `/documents/${id}`).then(response =>
      response.json()
    )
  }
}

export default new API()
