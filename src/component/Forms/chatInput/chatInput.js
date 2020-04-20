import React from 'react';
import classes from './chatInput.css'

const chatInput = props => {
  var height = 'auto'
  var textInput = document.getElementById('t')
  if (textInput) {
    height = 'auto'
    height = textInput.scrollHeight
    if (height > 55) {
      props.changeStyle(true)
    } else {
      props.changeStyle(false)

    }
  }

  return (
    <form onSubmit={props.sendChat} className={classes.msgInput + " row no-gutters"}>

      <div className="col-md-2 col-5 justify-content-around pb-1  d-flex align-items-center" style={{ alignSelf: "flex-end" }}>
        <button onClick={() => {
          textInput.style.height = 'auto'
          props.changeStyle(false)
        }} className={classes.btn}>
          <i className="material-icons o" >photo</i>
        </button>
        <button onClick={() => {
          textInput.style.height = 'auto'
          props.changeStyle(false)
        }} className={classes.btn}>
          <i className="material-icons " >videocam</i>
        </button>
        <button onClick={() => {
          textInput.style.height = 'auto'
          props.changeStyle(false)
        }} className={classes.btn}>
          <i className="material-icons " >audiotrack</i>
        </button>
      </div>
      <div className="col pt-1">
        <textarea id="t"
          style={{
            height: height + 'px'
          }} rows="1" type="text" required onChange={props.changed} value={props.value} placeholder="Aa" />
      </div>
      <div className="col-md-1 col-2 pb-1  d-flex align-items-center" style={{ alignSelf: "flex-end" }}>
        <button onClick={() => {
          textInput.style.height = 'auto'
          props.changeStyle(false)
        }} className="w-100 p-0 d-flex align-items-center" style={{
          border: 0,
          outline: 0,
          background: 'none'
        }}>
          <i className="material-icons h-100 mx-auto" style={{
            fontSize: '2.5rem',
            lineHeight: '1',
            color: 'orangered'
          }}>send</i>
        </button>
      </div>
    </form>
  )
}

export default chatInput