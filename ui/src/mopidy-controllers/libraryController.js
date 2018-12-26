export class LibraryController {
  client = null
  state = null

  constructor(client, state) {
    this.client = client
    this.state = state
  }

  browse(uri = null) {
    try {
      console.debug("browse, uri = " + uri)
      this.client.playback.browse(uri)
    } catch(e) {
      console.warn("exception when calling browse(): " + e)
    }
  }

  search(query = null, uris = null, exact = false) {
    try {
      console.debug("search, query = " + query + ", uris = " + uris + ", exact = " + exact)
      this.client.playback.search(query, uris, exact)
    } catch(e) {
      console.warn("exception when calling search(): " + e)
    }
  }

  lookup(uris = null) {
    try {
      console.debug("lookup, uris = " + uris)
      this.client.playback.lookup(uris)
    } catch(e) {
      console.warn("exception when calling lookup(): " + e)
    }
  }

  refresh(uri = null) {
    try {
      console.debug("refresh, uri = " + uri)
      this.client.playback.refresh(uri)
    } catch(e) {
      console.warn("exception when calling refresh(): " + e)
    }
  }

  getImages(uris) {
    return this.client.library.getImages(uris)
  }
}
