
import moment from 'moment';

export class TimeFormatValueConverter {
  toView(value) {
    let numVal = value/1
    // var milliseconds = numVal % 1000
    var seconds = Math.floor((numVal / 1000) % 60)
    var minutes = Math.floor((numVal / (60 * 1000)) % 60)
    var hours = Math.floor((numVal / (60 * 60 * 1000)) % 24)

    // console.debug("converting " + value + " to " + minutes + ":" + seconds)
    if ( seconds < 10 )
      seconds = "0" + seconds
    if ( minutes < 10 )
      minutes = "0" + minutes

    if ( hours == 0 )
      return minutes + ":" + seconds
    else
      return hours + ":" + minutes + ":" + seconds
  }
}
