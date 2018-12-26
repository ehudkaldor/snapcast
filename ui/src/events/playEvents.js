export class PlayingStateChanged {
  constructor(newState) {
    this.newState = newState
  }
}

export class PlayingPaused {
  constructor(time_position) {
    this.time_position = time_position
  }
}

export class PlayingResumed {
  constructor(time_position) {
    this.time_position = time_position
  }
}

export class PlayingStarted {}

export class PlayingEnded {
  constructor(time_position) {
    this.time_position = time_position
  }
}
