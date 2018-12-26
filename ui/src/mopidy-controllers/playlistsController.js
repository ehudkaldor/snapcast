export class PlaylistsController {
  client = null
  state = null

  constructor(client, state) {
    this.client = client
    this.state = state
  }

  getPlaylists() {
    try {
      console.debug("getPlayLists")
      this.client.playlists.asList()
    } catch(e) {
      console.warn("exception when calling getPlaylists(): " + e)
    }
  }
}
