import React, { Component } from "react";
import classes from "./Timeline.css";
import { withRouter, Link } from "react-router-dom";
import firebase from "../../../firebase";
import "firebase/auth";
import "firebase/storage";
import Spinner from "../../../component/UI/Spinner/Spinner";
import Friends from "../../../component/Friends/Friends";
import Request from "../../../component/Friends/Request";
import Alert from "../../../component/UI/Alert/Alert";
import Post from '../../../component/Posts/Posts';
import NewPost from '../../../component/Forms/NewPost/NewPost';
import play from '../../../component/Audio/Audio'

class Timeline extends Component {
  constructor(props) {
    super(props)
    this.progBar = React.createRef()
  }
  state = {
    profileData: {
      username: "",
      coverPhoto: "",
      uid: null
    },

    isUser: false,
    loading: false,
    profile: "",
    errorMessage: null,
    changeStyle: false,
    showPostForm: true,
    modalMessage: null,
    postTitle: "",
    postBody: "",
    type: null,
    src: null
  };

  componentDidMount() {
    this.load(this.props.profile);
    let theme = localStorage.getItem('skychatTheme');
    var metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (theme === 'dark') {
      metaThemeColor.setAttribute("content", ' #171e25');
    }
    else if (theme === 'light') {
      metaThemeColor.setAttribute("content", ' #fff');
    }


  }
  titleChanged = e => {
    this.setState({
      postTitle: e.target.value
    })
  }
  bodyChanged = e => {
    this.setState({
      postBody: e.target.value
    })
  }

  componentDidUpdate() {

    if (this.props.match.params.profile !== this.state.profile) {
      this.setState({ profile: this.props.match.params.profile });
      this.load(this.props.match.params.profile);
    }
  }
  sendPost = e => {
    this.setState({ play: null })
    e.preventDefault();
    var Post = {
      title: this.state.postTitle,
      icon: this.state.profileData.profilePicture,
      username: this.state.profileData.username,
      body: this.state.postBody.split("\n").join("<br/>"),
      type: this.state.type,
      src: this.state.src,
      storageRef: "/" + this.props.userData.username.toLowerCase() + "/" + this.state.type + '/' + this.state.sref,
      date: Date.now(),
      uid: this.state.profileData.uid
    }
    if (Post.title || Post.body || Post.src) {

      firebase.database().ref('posts/')
        .push(Post).then(res => {
          this.setState({ src: null, type: null })
          play('success')
        })
      this.setState({ postBody: '', postTitle: "" })
    } else {
      this.setState({ error: "Type something or pick an image/video to post" })
    }
  }

  upload = (types) => {
    // File or Blob named mountains.jpg

    this.setState({ showPostForm: false, error: null })
    var files = document.createElement('input')
    files.type = 'file'
    if (types === 'images') {
      files.setAttribute('accept', 'image/*')
    } else {
      files.setAttribute('accept', 'video/*')
    }
    files.click()
    files.onchange = e => {
      const storageRef = firebase.storage().ref('/' + this.props.userData.username.toLowerCase())

      const file = files.files[0];
      if (file.size > 10000000) {
        this.setState({ showPostForm: true, error: "File too large \n Maximum size is 10mb" })
      } else {
        const uploadTask = storageRef.child(types + "/" + file.name).put(file);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
          this.setState({ showPostForm: false })
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          var progressMessage = 'Upload is ' + Math.floor(progress) + '% Done. (' + (snapshot.totalBytes / 1000000).toFixed(2) + ' mb) '
          this.setState({ progressMessage: progressMessage })
          this.progBar.current.style.width = progress + '%'
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              this.setState({ progressMessage: 'Upload is paused' })

              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              break;
            default:
              break;
          }
        }, (error) => {
          this.setState({ showPostForm: true })

          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              this.setState({
                error: "You don't have permission to access the object"
              })
              break;
            case 'storage/canceled':
              this.setState({ error: "Upload canceled" })
              break;
            case 'storage/unknown':
              this.setState({ error: "Unknown error occurred" })
              // Unknown error occurred, inspect error.serverResponse
              break;
            default:
              this.setState({ error: "Unknown error occurred" })
              break;
          }
        }, () => {
          this.setState({ showPostForm: false, progressMessage: null })
          if (types === 'images') {

            var starsRef = uploadTask.snapshot.ref;

            // Get the download URL
            starsRef.getDownloadURL().then((URL) => {
              const url = URL.replace(file.name, file.name.split('.').join('_1024x1024.'))
              console.log(url);
              // Insert url into an <img> tag to "download"
              setTimeout(() => {
                this.setState({ showPostForm: true, type: types, progressMessage: null, src: url, sref: file.name.split('.').join('_1024x1024.') })
              }, 2000)
            })
          } else {
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
              this.setState({ showPostForm: true, type: types, progressMessage: null, src: url, sref: file.name })
            })
          }



        });
      }



    }
  }



  load = uid => {

    document.documentElement.scrollTop = 0;

    this.setState({ loading: true });
    var userExist = false;
    var ref = firebase.database().ref("users/");
    if (uid) {
      ref.child(uid).on('value', s => {
        const profiledata = {
          ...this.state.profileData
        };

        for (let key in s.val()) {
          profiledata[key] = s.val()[key];
          profiledata.uid = uid;
        }

        this.setState({
          profileData: profiledata
        });
        setTimeout(cur => {
          this.setState({
            loading: false
          });
        }, 1000)
        if (profiledata.username) {

          userExist = true;
        }
        if (profiledata.username === this.props.userData.username) {
          this.setState({
            isUser: true
          });
        } else {
          this.setState({
            isUser: false
          });
        }

        if (!userExist) {
          this.setState({
            errorMessage: (
              <span>
                User <strong className="text-capitalize">{profiledata.username}</strong> not
                found
              </span>
            )
          });
        }

      })

    }
  }


  render() {
    return (
      <React.Fragment>
        {this.state.errorMessage ? (
          <Alert type="danger" show={true}>
            {this.state.errorMessage}{" "}
          </Alert>
        ) : null}
        <div className="container ">
          <div className="row ">
            <div className="col-md-8 col-lg-7 p-0 order-md-2 px-lg-3">
              <div className="row no-gutters bg-white">
                <div className={classes.cover + " col "}>
                  <img src={this.state.profileData.coverPhoto} alt="" />
                  <div className={classes.dp}>
                    <img src={this.state.profileData.profilePicture} alt="" />
                  </div>
                  {this.state.loading ? (
                    <Spinner style={{ background: "var(--secondary)" }} />
                  ) : (
                      <h3 className={classes.username}>
                        {!this.state.isUser ? (
                          this.state.profileData.username
                        ) : (
                            <span>
                              {this.state.profileData.username} <small>(You)</small>
                            </span>
                          )}
                      </h3>
                    )}

                </div>
              </div>
              {this.state.isUser ? <div className="bg-white  text-center"> <Link to="/edit-profile" className="btn  btn-outline-dark rounded-pill px-5 mx-auto btn-sm" >Edit profile</Link></div> : null}
              <Friends {...this.state.profileData} />
              {this.state.isUser ?
                <Request hideAll={true} userData={this.props.userData} /> : null}

              {this.state.isUser ? this.state.progressMessage ? null : !this.state.showPostForm ? <div style={{ height: '10rem' }} className="bg-white"> <Spinner fontSize="8px" /> </div> : <NewPost
                titleChanged={this.titleChanged}
                bodyChanged={this.bodyChanged}
                title={this.state.postTitle}
                upload={this.upload}

                src={this.state.src}
                type={this.state.type}
                body={this.state.postBody}
                sendPost={this.sendPost}
              /> : null}
              {this.state.error ? (
                <Alert type="warning" show={true}>
                  {this.state.error}
                </Alert>
              ) : null}
              {this.state.progressMessage ? <div className={'row no-gutters pb-4 px-4 mb-2 bg-white'}>
                <h4 className="h5 font-weight-bold">{this.state.progressMessage}</h4>
                <div className={classes.progressBar}>
                  <span ref={this.progBar} ></span>
                </div>
              </div> : null}
              {this.state.profileData.uid ?
                <Post uid={this.state.profileData.uid} likeeId={this.props.userData.uid} /> : null}

            </div>

            <div className="col-md-4 col-lg-2 order-md-1 bg-white ">
              <div className="row no-gutters">
                <div className={" col "}></div>
              </div>
            </div>
            <div className="col-lg-3 order-md-3 bg-white ">
              <div className="row no-gutters">
                <div className={" col "}></div>
              </div>
            </div>
          </div>

        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Timeline);
