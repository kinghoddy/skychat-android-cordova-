import React, { Component } from 'react';
import classes from './friends.css';
import { Link } from 'react-router-dom';
import 'firebase/database';
import firebase from '../../firebase';
import Spinner from '../../component/UI/Spinner/Spinner'
import Toast from '../UI/Toast/Toast';
import Modal from '../UI/Modal/Modal';

import friendsImg from '../../assets/Image/friends.png';

class Friends extends Component {
    state = {
        friendsData: [],
        loading: false,
        uid: this.props.uid,
        toast: null
    }
    componentDidMount() {
        this.getFriends(this.props.uid)
        
    }
    componentDidUpdate() {
        if (this.state.uid !== this.props.uid) {
            this.setState({ uid: this.props.uid })
            this.getFriends(this.props.uid)
        }
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
                                if(snap.val()){

                                const friend = {
                                    username: snap.val().username,
                                    profilePicture: snap.val().profilePicture,
                                    uid: s.val().friendsId[keys]
                                }
                                friendsData.push(friend)
                                }
                            })
                    }
                    this.setState({ friendsData: friendsData.reverse(), loading: false })
        console.log(friendsData);
                } else {
                    this.setState({ friendsData: [], loading: false })

                }
            })
        }
    }
    allFriends = () => {
        this.setState({ showAllFriends: true })
    }

    render() {
        return (
            this.state.loading ? <Spinner fontSize="3px" /> : this.props.uid ? <div className="container-fluid p-0">
                <Modal show={this.state.showAllFriends} modalClosed={() => this.setState({ showAllFriends: false, seeMore: false })} >
                    <div className="d-flex  pb-3 align-items-center">
                        <img
                            className={classes.img}
                            src={this.props.profilePicture}
                            alt=""
                        />
                        <h4 className="h5 text-capitalize ml-4">{this.props.username}'s Friends <small>{this.state.friendsData.length}</small> </h4>
                    </div>
                    {this.state.friendsData.map((cur, i) => (
                        !this.state.seeMore ? i < 2 ?
                            <Link
                                to={"/" + cur.uid}
                                className={classes.friendList}
                                onClick={() => { this.setState({ showAllFriends: false, seeMore: false }) }}
                                key={cur.username}
                            >
                                <img
                                    src={cur.profilePicture}
                                    alt=""
                                />
                                <div style={{ fontSize: ' .9rem ' }} className="text-dark px-2  py-1 card-body">{cur.username}</div>
                            </Link>

                            : null : <Link
                                to={"/" + cur.uid}
                                className={classes.friendList}
                                key={cur.username}
                                onClick={() => { this.setState({ showAllFriends: false, seeMore: false }) }}

                            >
                                <img
                                    src={cur.profilePicture}
                                    alt=""
                                />
                                <div style={{ fontSize: ' .9rem ' }} className="text-dark px-2  py-1 card-body">{cur.username}</div>
                            </Link>
                    ))}
                    {this.state.friendsData.length > 2 ? <button className="rounded-pill d-flex mx-auto my-3 btn btn-sm btn-outline-primary" onClick={() => { this.setState({ seeMore: !this.state.seeMore }) }}>{this.state.seeMore ? "See less" : "See more ->"}</button> : null}
                </Modal>
                {this.state.toast ? <Toast>{this.state.toast}</Toast> : null}
                <div className="row bg-white border-bottom no-gutters">
                    <div className="col-12 px-3 d-flex align-items-center">
                        <i className="material-icons md-36 pr-2">perm_identity</i>
                        <h4 className="mb-0">
                            Friends{" "}
                            <span className="pl-2 font-weight-light">
                                {this.state.friendsData.length}
                            </span>
                        </h4>
                    </div>
                    <div className="col-12 px-3">
                        <div className={classes.horizontal_scroll + " row no-gutters "}>
                            {this.state.friendsData.map((cur, i) => (
                                i < 3 ? <div className="col-4 col-lg-3 px-1"
                                    key={i}
                                >
                                    <Link
                                        to={"/" + cur.uid}
                                        className={classes.friendCard}
                                    >
                                        <img
                                            src={cur.profilePicture}
                                            alt=""
                                        />
                                        <div style={{ fontSize: ' .9rem ' }} className="text-dark px-2  py-1 card-body">{cur.username}</div>
                                    </Link>
                                </div> : null
                            ))}
                            <div className="col-4 col-lg-3 px-1"
                            >
                                <button
                                    onClick={this.allFriends}
                                    className={classes.friendCard}
                                >
                                    <img
                                        alt=""

                                        src={friendsImg}
                                    />
                                    <div style={{ fontSize: ' .9rem ' }} className="text-dark px-2  py-1 card-body">See all friends</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : null
        )
    }
}


export default Friends
