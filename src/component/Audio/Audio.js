import loading from "../../assets/audio/ui_loading.wav";
import success from "../../assets/audio/completed.wav";

export default type => {
  var audio = document.createElement('audio');

  if (type === 'success') {
    audio.src = success
  } else {
    audio.src = loading
  }
  audio.play()
}

