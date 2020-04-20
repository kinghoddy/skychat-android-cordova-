import React, { Component } from "react";
import classes from "./Chatroom.css";

import { Link, withRouter } from "react-router-dom";
import ChatInput from "../../../component/Forms/chatInput/chatInput";
import Chat from "../../../component/Chats/Chat/Chat";
import GroupChat from "../../../component/Chats/Chat/groupChat";
import "firebase/database";
import "firebase/auth";
import firebase from "../../../firebase";
import Spinner from "../../../component/UI/Spinner/Spinner";

import Play from "../../../component/Audio/Audio";

class Chatroom extends Component {
  state = {
    value: "",
    path: null,
    chats: [],
    receiverData: {},
    senderData: {
      senderId: ""
    },
    loading: false,
    description: undefined,
    date: null,
    isGroup: true,
    changeStyle: false
  };
  inputChanged = e => {
    this.setState({ value: e.target.value });
  };
  componentDidMount() {
    this.setState({ loading: true });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var senderData = {};
        senderData.senderId = user.uid;
        senderData.username = user.displayName;
        senderData.profilePicture = user.photoURL;
        this.setState({ senderData: senderData });
        
        this.getChats(this.props.match.params.chatId)
      } else {
        this.setState({ loading: false });
      }
    });
  }
  changeStyle = change => {
    if (this.state.changeStyle !== change) {
      this.setState({ changeStyle: change });

      var con = document.getElementById("scroll");
      if (con) {
        setTimeout(() => {
          con.scrollTop = con.scrollHeight + 100000;
        }, 500);
      }
    }
  };
  componentDidUpdate() {
    if (this.props.match.params.chatId !== this.state.chatId) {
      this.setState({ chatId: this.props.match.params.chatId })
      this.getChats(this.props.match.params.chatId)
    }
  }
  getChats = (chatId, uid) => {
    
    const chatref = firebase.database().ref('chats/' + chatId)
    chatref.on('value', s => {
      console.log(s.val());
      let description
      let groupIcon
      if(s.val()){
         description = s.val().description
        groupIcon = s.val().icon
      }

      // checking if its a group
      if (description !== undefined) {
        this.setState({ isGroup: true, description: description, groupIcon: groupIcon })
        let members = {}
        for (let keys in s.val().metadata) {
          firebase.database().ref('users/' + keys).once('value', users => {
            members[keys] = {
              profilePicture: users.val().profilePicture,
              username: users.val().username
            }
          })
            
            var chats = []
            if(s.val()){

              for (let k in s.val().chats) {
                const chat = {
                  ...s.val().chats[k]
                }
                if (members[chat.sender]) {
                  chat.name = members[chat.sender].username
                  chat.profilePicture = members[chat.sender].profilePicture
                }
                chats.push(chat)
              }
            }

            var lastChat = chats[Object.keys(chats)[Object.keys(chats).length - 1]];
            if (lastChat.sender !== this.state.senderData.senderId && lastChat.sender !== 'time' && lastChat.sender && lastChat.sender !== 'skymail' && this.state.senderData.senderId) {
              Play()
            }
            this.setState({ chats: chats, date: lastChat.date, loading: false });

            var con = document.getElementById("scroll");
            if (con) {
              setTimeout(()=>{

                con.scrollTop = con.scrollHeight + 100;
              },500)
            }
        
        }
        this.setState({ members: members })


      } else {
        this.setState({ isGroup: false })
        var chats 
        if(s.val()){
          chats = s.val().chats;
        }
        if (chats) {
          var chat = [];
          for (let keys in chats) {
            const allChats = chats[keys]
            chat.push(allChats);
          }

          var lastChat = chats[Object.keys(chats)[Object.keys(chats).length - 1]];
          if (lastChat.sender !== this.state.senderData.senderId && lastChat.sender !== 'time' && lastChat.sender && lastChat.sender !== 'skymail' && this.state.senderData.senderId) {
            Play()

          }
          this.setState({ chats: chat, date: lastChat.date, loading: false });

        }
        // get receiver data
        for (let keys in s.val().metadata) {
          if (this.state.senderData.senderId) {
            if (keys !== this.state.senderData.senderId) {
              firebase.database().ref('users/' + keys).on('value', snap => {
                var receiverData = {};
                receiverData.profilePicture = snap.val().profilePicture;
                receiverData.username = snap.val().username;
                receiverData.uid = keys;
                this.setState({ receiverData: receiverData });
                document.title =
                  receiverData.username +
                  " And " +
                  this.state.senderData.username +
                  " | Skychat";
                setTimeout(() => {
                  var con = document.getElementById("scroll");
                  con.scrollTop = con.scrollHeight + 100;

                }, 50)

              })
            }
          }
        }






      }
    })
  }
  sendChats = event => {
    this.setState({ changeStyle: false });
    event.preventDefault();
    var chatId = this.props.match.params.chatId;

    var ref = firebase.database().ref("chats/" + chatId + "/chats");
    var val = this.state.value.split("\n").join("<br/>");
    var dat = Date.now();
    firebase.database().ref("chats/" + chatId + '/modified').set(dat)

    var now = new Date();
    var currentTime = now.getTime();
    var lastTime = new Date(this.state.date).getTime();
    var difference = (currentTime - lastTime) / 1000;
    if (difference > 125) {
      ref.push({
        date: dat,
        message: dat,
        sender: "time"
      })
      ref.push({
        date: dat,
        message: val,
        sender: this.state.senderData.senderId
      })

    } else {
      ref
        .push({
          date: dat,
          message: val,
          sender: this.state.senderData.senderId
        })
    }


    this.setState({ value: "" });
  };

  render() {
    return (
      <div className={classes.chatroom}>
        <nav
          className={
            classes.navbar + "  navbar navbar-expand navbar-light"
          }
        >
          <Link to="/messages/">
            <i
              style={{ cursor: "pointer" }}
              className="text-dark material-icons mr-2 d-lg-none"
            >
              arrow_back
            </i>
          </Link>
          <Link
            to={"/" + this.state.receiverData.uid}
            className={classes.icon + " p-0 navbar-brand"}
          >
            <img src={this.state.isGroup ?this.state.groupIcon : this.state.receiverData.profilePicture} alt="" />
          </Link>
          {this.state.receiverData.username ? (
            <div>
              <h1 className="text-dark mb-0 h5 text-capitalize" style={{ lineHeight: "1" }}>
                {this.state.receiverData.username.substring(0, 18) +
                  (Array.from(this.state.receiverData.username).length > 18
                    ? "..."
                    : "")}
              </h1>
              <p style={{ lineHeight: "1" }} className="text-dark m-0 font-weight-light">Active now</p>
            </div>
          ) :       <h1 className="text-dark mb-0 h5 text-capitalize" style={{ lineHeight: "1" }}>
              {this.props.match.params.chatId.substring(0, 18) +
                (Array.from(this.props.match.params.chatId).length > 18
                    ? "..."
                    : "")}
              </h1>}
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link py-0" to="">
                  <i className="material-icons">info</i>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <div
          style={
            this.state.changeStyle
              ? { marginBottom: "8.2rem", height: " calc(100% - 8.2rem)" }
              : null
          }
          className={classes.chats}
          id="scroll"
        >
          <div>
            {!this.state.loading ? (
              <div className="py-5 ">
                <div
                  className="mb-3 d-flex justify-content-center"
                  style={{ height: "8rem" }}
                >
                  {this.state.isGroup ? <img
                    src={this.state.groupIcon}
                    className="h-100 rounded-circle"
                    alt=""
                    style={{ width: '8rem ', objectFit: "cover" }}

                  /> : <React.Fragment>

                      <img
                        src={this.state.senderData.profilePicture}
                        className="h-100 rounded-circle "
                        alt=""
                        style={{ width: '8rem ', objectFit: "cover" }}
                      />
                      <img
                        src={this.state.receiverData.profilePicture}
                        className="h-100 rounded-circle"
                        alt=""
                        style={{ width: '8rem ', objectFit: "cover" }}

                      />
                    </React.Fragment>}
                </div>
                <h2 className="text-center h5">
                  You and {this.state.receiverData.username} are now friends
                </h2>
              </div>
            ) : null}

            {this.state.chats.map((cur, i) => {

              return (
                this.state.isGroup ? <GroupChat
                  key={i}
                  seen={cur.seen}
                  date={cur.date}
                  added={cur.added}
                  name={cur.name}
                  sender={cur.sender}
                  icon={cur.profilePicture}
                >{cur.message}
                </GroupChat> : <Chat
                  key={i}
                  seen={cur.seen}
                  date={cur.date}
                  added={cur.added}
                  sender={cur.sender}
                  icon={this.state.receiverData.profilePicture}
                >
                    {cur.message}
                  </Chat>
              );
            })}
            {this.state.loading ? (
              <div className="pb-3 mb-3">
                <Spinner fontSize="3px" />
              </div>
            ) : null}
          </div>
        </div>
        {/* chat input */}
        <ChatInput
          changeStyle={this.changeStyle}
          changed={this.inputChanged}
          value={this.state.value}
          sendChat={this.sendChats}
        />
      </div >
    );
  }
}
export default withRouter(Chatroom);

/*

*/
