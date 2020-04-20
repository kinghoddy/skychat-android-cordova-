import React, { Component } from 'react';
import Post from './Post/Post';
import firebase from '../../firebase';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

import Toast from '../UI/Toast/Toast'
import Spinner from '../UI/Spinner/Spinner';
import play from '../Audio/Audio'

export default class Posts extends Component {
    state = {
        posts: [],
        loading: false
    }

    componentDidMount() {
        // this.setState({loading : true})
        const user = firebase.auth().currentUser
        if (user) {
        }
        this.getPosts(this.props.uid)
    }
    componentDidUpdate() {
        if (this.state.uid !== this.props.uid) {
            this.setState({ uid: this.props.uid })
            this.getPosts(this.props.uid)
        }
    }
    deletePost = (id, src) => {
        if (src) {
            var desertRef = firebase.storage().ref(src);
            desertRef.delete()
            firebase.database().ref('posts/' + id).set(null)
        } else {
            firebase.database().ref('posts/' + id).set(null)
        }
    }
    getPosts = (uid) => {
        this.setState({ loading: true })
        const ref = firebase.database().ref('posts/').orderByChild('uid').equalTo(uid)
        ref.on('value', s => {
            const posts = []
            for (let key in s.val()) {
                firebase.database().ref('users/' + s.val()[key].uid).on('value', snap => {
                    const post = {
                        title: s.val()[key].title,
                        body: s.val()[key].body,
                        id: key,
                        icon: snap.val().profilePicture,
                        username: snap.val().username,

                        date: s.val()[key].date,
                        type: s.val()[key].type,
                        uid: s.val()[key].uid,
                        liked: false,
                        storageRef: s.val()[key].storageRef,
                        likes: s.val()[key].likes,
                        src: s.val()[key].src,
                    }
                    if (s.val()[key].uid === this.props.likeeId) {
                        post.isMine = true
                    }
                    if (s.val()[key].comments) {
                        const com = []
                        for (let keys in s.val()[key].comments) {
                            com.push(s.val()[key].comments[keys])
                        }
                        post.comments = com.reverse()
                    }

                    if (post.likes) {

                        if (post.likes[this.props.likeeId]) {
                            post.liked = true
                        }
                    }
                    posts.push(post)
                })

            }
            this.setState({ posts: posts.reverse(), loading: false })



        })
    }
    postComment = (e, text, id) => {
        e.preventDefault()
        console.log('post', text, id);
        firebase.database().ref('users/' + this.props.likeeId).once('value', s => {
            const comment = {
                username: s.val().username,
                profilePicture: s.val().profilePicture,
                uid: this.props.likeeId,
                date: Date.now(),
                comment: text
            }
            firebase.database().ref('posts/' + id + "/comments").push(comment).then(() => {
                play('success')
            })
        })

    }
    render() {
        return (
            this.state.loading ? <div style={{ height: "5rem" }}><Spinner fontSize="3px" /></div> : <div className="pt-2 ">
                {this.state.toast ? <Toast message={this.setState.toast} /> : null}
                <h4 className="pl-4 py-3 bg-white m-0">Posts <small>{this.state.posts.length}</small> </h4>
                {this.state.posts.map(cur => (

                    <Post
                        {...cur}
                        key={cur.id}
                        postComment={(e, val) => { this.postComment(e, val, cur.id) }}
                        deletePost={() => { this.deletePost(cur.id, cur.storageRef) }}
                        likeeId={this.props.likeeId}

                    />
                ))}
                <p className="text-center">No more posts </p>

            </div>
        )
    }
}