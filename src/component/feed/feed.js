import React, { Component } from 'react';
import classes from './feed.css';
import firebase from '../../firebase';
import { withRouter } from 'react-router-dom'
import 'firebase/auth';
import Spinner from '../UI/Spinner/Spinner';
import Toast from '../UI/Toast/Toast'
import Post from '../Posts/Post/Post';
import play from '../Audio/Audio'

class Feed extends Component {
    state = {
        loading: false,
        userData: {},
        posts: []

    }
    componentDidMount() {
        const user = firebase.auth().currentUser
        this.setState({ loading: true });
        if (user) {
            let hasUsed = localStorage.getItem('hasUsedSkychat');
            if (hasUsed === null) {
                localStorage.setItem('hasUsedSkychat', true)
            }
            const userdata = {
                ...this.state.userData
            };
            userdata.profilePicture = user.photoURL;
            userdata.uid = user.uid;
            userdata.username = user.displayName.toLowerCase();

            this.setState({
                loading: false,
                shouldLogout: false,
                userData: userdata
            });
        } else {
            this.setState({ shouldLogout: true, loading: false });
        }
        document.title = "News feed | Skychat";


        let theme = localStorage.getItem('skychatTheme');
        var metaThemeColor = document.querySelector("meta[name=theme-color]");
        if (theme === 'dark') {
            metaThemeColor.setAttribute("content", ' #171e25');
        }
        else if (theme === 'light') {
            metaThemeColor.setAttribute("content", ' #fff');
        }

        if (this.props.uid) {

            this.getPosts()
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
    getPosts = () => {
        document.documentElement.scrollTop = 0;

        this.setState({ loading: true })
        const ref = firebase.database().ref('users/')
        ref.child(this.props.uid).on('value', s => {

            let friendsId = s.val()['friendsId']
            let friendsArr = [this.props.uid]
            for (let key in friendsId) {
                friendsArr.push(friendsId[key])
            }

            const feedRef = firebase.database().ref('posts/')
            feedRef.on('value', snap => {
                const Posts = []
                for (let key in snap.val()) {

                    friendsArr.forEach(cur => {
                        if (snap.val()[key].uid === cur) {

                            const post = {
                                title: snap.val()[key].title,
                                body: snap.val()[key].body,
                                id: key,
                                icon: snap.val()[key].icon,
                                username: snap.val()[key].username,
                                date: snap.val()[key].date,
                                type: snap.val()[key].type,
                                liked: false,
                                uid: snap.val()[key].uid,
                                storageRef: snap.val()[key].storageRef,
                                likes: snap.val()[key].likes,
                                src: snap.val()[key].src,
                            }

                            ref.child(snap.val()[key].uid).once('value', sn => {
                                post.icon = sn.val().profilePicture
                                post.username = sn.val().username
                            })
                            if (snap.val()[key].uid === this.props.uid) {
                                post.isMine = true
                            }
                            if (snap.val()[key].comments) {
                                const com = []
                                for (let keys in snap.val()[key].comments) {
                                    com.push(snap.val()[key].comments[keys])
                                }
                                post.comments = com.reverse()
                            }

                            if (post.likes) {
                                if (post.likes[this.props.uid]) {
                                    post.liked = true
                                }
                            }
                            Posts.push(post)
                        }
                    })

                }
                // setTimeout(() => {
                this.setState({ posts: Posts.reverse(), loading: false })
                // }, 2000)


            })
        })
    }
    componentDidUpdate() {
        if (this.state.shouldLogout) {
            this.props.history.push('/login?feed')
        }
    }
    postComment = (e, text, id) => {
        e.preventDefault()
        console.log('post', text, id);
        firebase.database().ref('users/' + this.props.uid).once('value', s => {
            const comment = {
                username: s.val().username,
                profilePicture: s.val().profilePicture,
                uid: this.props.uid,
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
            <div className={classes.wrapper + " pt-2 mx-auto"}>
                {this.state.toast ? <Toast message={this.setState.toast} /> : null}


                {this.state.loading ? <div style={{ height: '79vh', marginBottom: "3rem" }}><Spinner style={{ background: 'var(--gray)' }} /> <p className={classes.brand}>skychat by odunmilade</p></div> : this.state.posts.map(cur => (

                    <Post

                        {...cur}
                        postComment={(e, val) => { this.postComment(e, val, cur.id) }}
                        key={cur.id}
                        deletePost={() => { this.deletePost(cur.id, cur.storageRef) }}
                        likeeId={this.props.uid}
                    />
                ))}
                <p className="text-center">No more posts </p>

            </div>
        )
    }
}
export default withRouter(Feed)