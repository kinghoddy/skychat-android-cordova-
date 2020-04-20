import React, { Component } from "react";
import "firebase/database";
import { withRouter } from 'react-router-dom';
import firebase from "../../firebase";
import Spinner from "../../component/UI/Spinner/Spinner";
import Search from "../../component/Forms/Search/Searxh";
import Toast from "../../component/UI/Toast/Toast";

class Friends extends Component {
  state = {
    loading: false,
    allUsers: null,
    toast: null,
    request: []
  };
  componentDidMount() {
    this.getRequest();
    this.getAllUsers();
  }
  getAllUsers() {
    this.setState({ loading: true });

    var ref = firebase.database().ref("users/");
    ref.on("value", s => {
      var allUsers = [];
      if (this.props.userData.uid) {
        var friends = s.val()[this.props.userData.uid].friendsId;
        var friendsId = [];
        // updating the friends id array
        if (friends) {
          for (let keys in friends) {
            friendsId.push(friends[keys]);
          }
        }
        // checking if the user isnt you then updating the array
        for (let key in s.val()) {
          if (s.val()[key].username !== this.props.userData.username) {
            //   checking if request already sent
            var user = {
              username: s.val()[key].username,
              profilePicture: s.val()[key].profilePicture,
              uid: key
            };
            var requests = s.val()[key].requestsId;
            for (let ids in requests) {
              if (requests[ids] === this.props.userData.uid) {
                user = {
                  username: s.val()[key].username,
                  profilePicture: s.val()[key].profilePicture,
                  uid: key,
                  sent: true
                };
              }
            }

            allUsers.push(user);
          }
        }
        // removing friends from the all users array
        var remove = [];
        friendsId.forEach(cur => {
          allUsers.forEach((key, i) => {
            if (cur === key.uid) {
              remove.push(i);
            }
          });
        });
        for (var i = remove.length - 1; i >= 0; i--) allUsers[remove[i]] = null;
        //# removing friends from the all users array

        this.setState({ loading: false, allUsers: allUsers });
      }
    });
  }
  sendRequest = (receiverId, index) => {
    var ref = firebase.database().ref("/users/" + receiverId + "/requestsId");
    ref
      .push(this.props.userData.uid)
      .then(res => {
        this.setState({ toast: null });
        this.setState({ toast: "Request sent" });
      })
      .catch(res => {
        this.setState({ toast: "Request  notsent" });
      });
  };
  getRequest = () => {
    var ref = firebase
      .database()
      .ref("users/" + this.props.userData.uid + "/requestsId");
    ref.on("value", s => {
      const req = [];
      for (let keys in s.val()) {
        req.push({
          friendId: s.val()[keys],
          requestId: keys
        });
      }
      const request = [];
      req.forEach(element => {
        var ref = firebase.database().ref("users/" + element.friendId);
        ref.on("value", snap => {
          var user = {
            username: snap.val().username,
            profilePicture: snap.val().profilePicture,
            uid: element.friendId,
            reqId: element.requestId
          };
          request.push(user);
        });
      });

      this.setState({ request: request });
    });
  };
  acceptRequest = (uid, uname, photo, index, reqId) => {
    var ref = firebase.database().ref("users/" + uid);
    var myRef = firebase.database().ref("users/" + this.props.userData.uid);
    var chatId = this.props.userData.username + "&" + uname;

    var chatsRef = firebase.database().ref("chats/" + chatId);
    ref.child("friendsId").push(this.props.userData.uid);
    ref.child("chatsId").push(chatId);
    myRef.child("friendsId").push(uid);
    myRef.child("chatsId").push(chatId);

    chatsRef
      .set({
        metadata: {
          [this.props.userData.uid]: {
            profilePicture: this.props.userData.profilePicture,
            username: this.props.userData.username
          },
          [uid]: {
            profilePicture: photo,
            username: uname
          }
        }
      })
      .then(res => {
        chatsRef.child("chats/").push({
          message:
            "You are now connected together. Enjoy messaging in the cloud ",
          sender: "skymail",
          date: Date.now()
        });
        const request = this.state.request;
        request.splice(index, 1);
        this.setState({ request: request });
      });

    var updates = {};
    updates[
      "/users/" + this.props.userData.uid + "/requestsId/" + reqId
    ] = null;
    updates["/users/" + uid + "/requestsId/" + reqId] = null;
    return firebase
      .database()
      .ref()
      .update(updates);
  };
  declineRequest = (uid, reqId) => {
    var updates = {};
    updates[
      "/users/" + this.props.userData.uid + "/requestsId/" + reqId
    ] = null;
    updates["/users/" + uid + "/requestsId/" + reqId] = null;
    return firebase
      .database()
      .ref()
      .update(updates);
  };
  cancelRequest = receiverId => {
    var ref = firebase.database().ref("/users/" + receiverId + "/requestsId");
    ref.on("value", s => {
      for (let keys in s.val()) {
        if (s.val()[keys] === this.props.userData.uid) {
          firebase
            .database()
            .ref("/users/" + receiverId + "/requestsId/" + keys)
            .remove()
            .then(() => {
              this.setState({ toast: null });
              this.setState({ toast: "Request canceled" });
            });
        }
      }
    });
  };
  render() {
    return (
      <div className="container-fluid p-0">
        {this.state.toast ? <Toast>{this.state.toast}</Toast> : null}
        <div className="border-bottom row no-gutters bg-white py-3">
          <h1 className="col-12 px-3  h4">
            You have {this.state.request.length} Friend request
            <small>(s)</small>{" "}
          </h1>
          {this.props.hideReq ? null : this.state.request.map((cur, i) => (
            <div
              className="row align-items-center py-2 px-3 no-gutters "
              key={cur.uid}
            >
              <div className="col-3 col-md-2">
                <img
                  src={cur.profilePicture}
                  alt=""
                  style={{
                    height: "3.5rem",
                    width: "3.5rem",
                    objectFit: "cover"
                  }}
                  className=" rounded-circle border"
                />
              </div>
              <div className="col-9 pl-4">
                <h5 className="text-capitalize h6 font-weight-bold">
                  {cur.username}
                </h5>
                <div className="d-flex ">
                  <button
                    onClick={() => {
                      this.declineRequest(cur.uid, cur.reqId);
                    }}
                    className="btn-sm px-3 btn btn-red"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => {
                      this.acceptRequest(
                        cur.uid,
                        cur.username,
                        cur.profilePicture,
                        i,
                        cur.reqId
                      );
                    }}
                    className="btn-sm btn btn-outline-warning ml-3 px-5"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {this.props.hideAll ? null : <div className="border-bottom row no-gutters bg-light py-5">
          <h3 className="col-12 pl-3 h5"> Find new friends to fly with</h3>
          <div className="col-12 px-3">
            <Search />
          </div>
          <div className="col-12 pt-4">
            {!this.state.allUsers ? (
              <Spinner fontSize="4px" />
            ) : (
                this.state.allUsers.map((cur, i) =>
                  cur ? (
                    <div
                      className="row align-items-center py-2 px-3 no-gutters "
                      key={i}
                    >
                      <div className="col-2 col-md-1" onClick={() => {
                        this.props.history.push('/' + cur.uid)
                      }}>
                        <img
                          src={cur.profilePicture}
                          alt=""
                          style={{
                            height: "3.5rem",
                            width: "3.5rem",
                            objectFit: "cover"
                          }}
                          className="rounded-circle border"
                        />
                      </div>
                      <div className="col pl-4">
                        <h5 className="text-capitalize h6 font-weight-bold">
                          {cur.username}
                        </h5>
                        <div>
                          {cur.sent ? (
                            <button
                              onClick={() => {
                                this.cancelRequest(cur.uid);
                              }}
                              className="btn btn btn-red"
                            >
                              X <span className="pl-3"> Cancel Request</span>
                            </button>
                          ) : (
                              <button
                                onClick={() => {
                                  this.sendRequest(cur.uid, i);
                                }}
                                className="btn btn btn-outline-success"
                              >
                                + <span className="pl-4">Add friend</span>
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ) : null
                )
              )}
          </div>
        </div>}
      </div>
    );
  }
}

export default withRouter(Friends);
