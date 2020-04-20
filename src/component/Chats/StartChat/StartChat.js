import React, { Component } from 'react';
import firebase from '../../../firebase';
import classes from './StartChat.css';
import 'firebase/database';
import { withRouter } from 'react-router-dom'
import Spinner from '../../UI/Spinner/Spinner'
import Picture from '../../../assets/Image/group.png'
import chat from '../Chat/groupChat';

class StartChat extends Component {

    state = {
        users: [],
        loading: false,
        friends: [],
        username: "",
        profilePicture: "",
        icon: Picture,
        uid: null,
        members: [],
        name: "",
        description: ""
    }

    componentDidMount() {
        this.getUsers();
    }
    componentDidUpdate() {
        if (this.state.uid !== this.props.uid) {
            this.setState({
                uid: this.props.uid,
                username: this.props.username,
                profilePicture: this.props.profilePicture
            })
            this.getFriends(this.props.uid)
        }
    }
    inputChange = (e) => {
        this.setState({ name: e.target.value })

    }
    descChange = (e) => {
        this.setState({ description: e.target.value })
    }
    getUsers = () => {
        this.setState({ loading: true })
        var ref = firebase.database().ref('users/')
        ref.on('value', s => {
            const users = []
            var uid = s.val()
            for (let key in uid) {
                const user = {}
                user.username = uid[key].username
                user.userId = key
                user.profilePicture = uid[key].profilePicture
                users.push(user)
            }
            // removing friends from the all users array
            var friends = [...this.state.friends]


            var remove = [];
            friends.forEach(cur => {
                users.forEach((el, i) => {
                    if (cur.userId === el.userId) {
                        remove.push(i);
                    }
                });
            });
            for (var i = remove.length - 1; i >= 0; i--) users[remove[i]] = null;
            this.setState({ users: users, loading: false })

        })
    }

    toggleMember = (e, arr) => {
        const members = [...this.state.members]
        let shouldSplit = null
        let checked = '<i class="mr-3 text-success  ml-auto material-icons">check_circle</i>'
        if (e.currentTarget.children[0].children[2]) {
            e.currentTarget.children[0].children[2].outerHTML = ''
        } else {
            e.currentTarget.children[0].innerHTML += checked
        }
        members.forEach((cur, i) => {
            if (cur === arr) {
                shouldSplit = i
            }
        })
        if (shouldSplit !== null) {
            members.splice(shouldSplit, 1)
        } else {
            members.push(arr)
        }
        this.setState({ members: members })
    }

    getFriends(uid) {
        if (uid) {
            this.setState({ loading: true })
            var ref = firebase.database().ref('users/' + uid)
            ref.on('value', s => {
                if (s.val().friendsId) {
                    const friendsData = []
                    for (let keys in s.val().friendsId) {
                        firebase.database().ref('users/' + s.val().friendsId[keys])
                            .once('value', snap => {
                                const friend = {
                                    username: snap.val().username,
                                    userId: s.val().friendsId[keys],
                                    profilePicture: snap.val().profilePicture
                                }
                                friendsData.push(friend)
                            })
                    }
                    this.setState({ friends: friendsData, loading: false })
                } else {
                    this.setState({ friends: [], loading: false })

                }
            })
        }
    }
    createGroup = (e) => {
        e.preventDefault();
        const chatref = firebase.database().ref('chats/' + this.state.name.toLocaleLowerCase())
        chatref.once('value', s => {
            if (s.val()) {
                alert('Group name exists \n Pick another group name ')
            } else {
                chatref.child("chats/").push({
                    message: this.state.username + " created the group",
                    sender: 'added',
                    date: Date.now()
                });
                firebase.database().ref('users/' + this.state.uid + "/chatsId").push(this.state.name)
                this.state.members.forEach(cur => {
                    const memberRef = firebase.database().ref('users/' + cur.userId)
                    memberRef.child('chatsId').push(this.state.name)

                    chatref.child('metadata/' + cur.userId).set({
                        username: cur.username,
                        profilePicture: cur.profilePicture
                    })
                    chatref.child("chats/").push({
                        message: this.state.username,
                        added: cur.username,
                        sender: 'added',
                        date: Date.now()
                    });
                })
                chatref.child('metadata/' + this.state.uid).set({
                    username: this.state.username,
                    owner: true,
                    profilePicture: this.state.profilePicture
                })
                chatref.child('icon').set(this.state.icon)
                chatref.child('description').set(this.state.description).then(res => {
                    this.props.history.push('/messages/' + this.state.name)
                })
            }
        })





    }

    render() {

        return (
            this.state.loading ? <Spinner /> : <div className={this.state.members.length > 0 && !this.state.showForm ? classes.pushed : null}>
                {
                    this.state.showForm ? <form onSubmit={this.createGroup} className="px-3 py-2">
                        <div className="d-flex pb-4 justify-content-between">
                            <button type="button" onClick={() => {
                                this.setState({ showForm: false })
                            }} className={classes.next + " rounded-pill  btn btn-sm btn-outline-success"}>{'<-'} Back</button>
                            <button className={classes.next + " rounded-pill  btn btn-sm btn-outline-success"}> Finish -></button>
                        </div>
                        <input onChange={this.inputChange} value={this.state.name} type="text" placeholder="Group name" style={{
                            background: "#f7f7f7",
                            border: "none",
                            margin: " 0 0 1.5rem 0",
                            width: "100%",
                            padding: ".5rem 1rem "
                        }} required />
                        <textarea onChange={this.descChange} value={this.state.description} style={{
                            background: "#f7f7f7",
                            border: "none",
                            width: "100%",
                            padding: ".5rem 1rem "
                        }} rows="3" placeholder="Group description" required />

                        <h4 className="pt-4"><i className="material-icons pr-3">people</i>Members {this.state.members.length + 1} </h4>
                        <div className={classes.horizontal + " pb-3 mt-2"}>
                            <div className="text-center pr-3" >
                                <img src={this.state.profilePicture} alt=""
                                    style={{ objectFit: 'cover', background: "var(--light)", height: "4rem", width: "4rem" }}
                                    className="rounded-circle border " />
                                <p>You</p>
                            </div>
                            {this.state.members.map(cur => (
                                <div className="text-center pr-3" key={cur.userId}>
                                    <img src={cur.profilePicture} alt=""
                                        style={{ objectFit: 'cover', background: "var(--light)", height: "4rem", width: "4rem" }}
                                        className="rounded-circle border " />
                                    <p>{cur.username.substring(0, 6) + (Array.from(cur.username).length > 6 ? '...' : '')}</p>
                                </div>
                            ))}

                        </div>
                    </form> : null
                }

                {
                    this.state.showForm ? null :
                        <React.Fragment>
                            {this.state.members.length > 0 ? <div className={classes.fixed + " mb-3 px-3 border-bottom"}>
                                <div className="d-flex pb-2 justify-content-between align-items-center">  <p>{this.state.members.length} selected</p>
                                    {this.state.members.length > 1 ? <button onClick={() => {
                                        this.setState({ showForm: true })
                                    }} className={classes.next + " rounded-pill  btn btn-sm btn-outline-success"}>Next -></button> : null} </div>
                                <div className={classes.horizontal}>
                                    {this.state.members.map(cur => (
                                        <div className="text-center pr-3" key={cur.userId}>
                                            <img src={cur.profilePicture} alt=""
                                                style={{ objectFit: 'cover', background: "var(--light)", height: "4rem", width: "4rem" }}
                                                className="rounded-circle border " />
                                            <p>{cur.username.substring(0, 6) + (Array.from(cur.username).length > 6 ? '...' : '')}</p>
                                        </div>
                                    ))}
                                </div>
                            </div> : null}
                            <h5 className="px-3 d-flex align-items-center"><i className="material-icons md-36 pr-2">group_add</i> Add members </h5>

                            <h6 className="px-3">Friends</h6>
                            {this.state.friends.map((cur, i) => (
                                <div className=" text-dark px-3 py-1 d-block" key={cur.userId} onClick={(e) => {
                                    this.toggleMember(e, cur)
                                }}>
                                    <div className="row">
                                        <div className="col-3">
                                            <img src={cur.profilePicture} alt=""
                                                style={{ objectFit: 'cover', background: "var(--light)", height: "4rem", width: "4rem" }}
                                                className="rounded-circle border " />
                                        </div>
                                        <p className="px-3">{cur.username}</p>
                                    </div>
                                </div>
                            ))}

                            <h6 className="px-3 mt-5">All users</h6>

                            {this.state.users.map((cur, i) => (
                                cur ?
                                    <div className="text-dark px-3 py-1 d-block" key={cur.userId} onClick={(e) => {
                                        this.toggleMember(e, cur)
                                    }}>
                                        <div className="row">
                                            <div className="col-3">
                                                <img src={cur.profilePicture} alt=""
                                                    style={{ objectFit: 'cover', background: "var(--light)", height: "4rem", width: "4rem" }}
                                                    className="rounded-circle border " />
                                            </div>
                                            <p className="px-3">{cur.username}</p>
                                        </div>
                                    </div>
                                    : null
                            ))} </React.Fragment>
                }
            </div >
        )
    }
}

export default withRouter(StartChat)