/* eslint-disable default-case */
import React, { Component } from 'react';
import firebase from '../../firebase';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage'
import classes from './Edit.css';
import Spinner from '../../component/UI/Spinner/Spinner';
import Alert from '../../component/UI/Alert/Alert'


export default class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.file = React.createRef();
        this.progBar = React.createRef()
    }
    state = {

        userData: {
            username: "",
            phoneNumber: ""
        },
        loading: false,
        message: null
    }
    componentDidMount() {
        document.title = "Edit userdata | Skychat";
        this.setState({ loading: true })
        firebase.auth().onAuthStateChanged(user => {
            if (user) {

                firebase.database().ref('users/' + user.uid)
                    .on('value', snapshot => {
                        const userdata = {
                            username: snapshot.val().username,
                            uid: user.uid,
                            profilePicture: snapshot.val().profilePicture,
                            coverPhoto: snapshot.val().coverPhoto
                        }
                        this.setState({ userData: userdata, loading: false })
                    })
            }
        })
    }
    updateName = (e) => {
        e.preventDefault()
        let user = firebase.auth().currentUser

        user
            .updateProfile({
                displayName: this.state.userData.username.toLowerCase()
            }).then(() => {
                var ref = firebase.database().ref("users/");
                const id = user.uid;
                ref
                    .child(id + "/username")
                    .set(user.displayName.toLowerCase(),
                    )
            })

    }
    nameChanged = (e) => {
        let user = firebase.auth().currentUser
        const userdata = { ...this.state.userData }
        userdata.username = e.target.value
        this.setState({
            userData: userdata
        })

    }
    upload = (types) => {
        const type = types
        // File or Blob named mountains.jpg
        // this.setState({ loading: true, message: "Uploading image" })
        var files = this.file.current
        files.click()
        files.onchange = e => {
            const storageRef = firebase.storage().ref('/' + this.state.userData.username.toLowerCase())
            const file = files.files[0];

            const uploadTask = storageRef.child('images/' + type).put(file);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
                this.setState({ loading: false })
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
                }
            }, (error) => {
                this.setState({ loading: false })

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
                }
            }, () => {
                this.setState({ loading: true, progressMessage: null })

                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    firebase.database().ref('users/' + this.state.userData.uid + "/" + type)
                        .set(downloadURL.replace(type, type + '_1024x1024')).then(cur => {

                            this.setState({ loading: false })

                        }).catch(err => {
                            this.setState({ loading: false, error: err })
                        });
                    var user = firebase.auth().currentUser;

                    if (type === 'profilePicture') {
                        user.updateProfile({
                            photoURL: downloadURL.replace(type, type + '_1024x1024')
                        }).catch(function (error) {
                            this.setState({ error: error })
                            // An error happened.
                        })
                    }
                });

            })
        }
    }
    render() {

        return (
            <div className={classes.pageBg}>
                <div className={"row no-gutters bg-white " + classes.con}>

                    <div className={classes.cover + " col-12"}>
                        <button className={classes.btnBack} onClick={this.props.history.goBack} >
                            <i className="material-icons">arrow_back</i>
                        </button>
                        <img alt="" src={this.state.userData.coverPhoto} />
                        <input type="file" accept="image/*" className="d-none" ref={this.file} />
                        <div className={classes.profilePic}>
                            <img alt="" src={this.state.userData.profilePicture} className={" rounded-circle "} />
                            <i onClick={() => {
                                this.upload('profilePicture')
                            }} className="material-icons rounded-circle ">camera_alt</i>
                        </div>
                        <i onClick={() => {
                            this.upload('coverPhoto')
                        }} className="material-icons rounded-circle ">camera_alt</i>

                    </div>
                    <div style={{ marginTop: "8rem" }} className={'col-12 bg-light  ' + classes.coperate}>
                        {this.state.error ? <Alert type="warning">{this.state.error}</Alert> : null}
                        {this.state.loading ? <div className="py-5 bg-white"><Spinner message={this.state.message} fontSize="6px" /></div> :
                            this.state.progressMessage ? <div className={'row no-gutters pb-4 px-4 mb-2 bg-white'}>
                                <h4 className="h5 font-weight-bold">{this.state.progressMessage}</h4>
                                <div className={classes.progressBar}>
                                    <span ref={this.progBar} ></span>
                                </div>
                            </div> : null}
                        {this.state.loading ? null : <React.Fragment >
                            <form className={'row no-gutters mb-2 bg-white'} onSubmit={this.updateName}>
                                <div className={'col-2 text-center text-primary'}>
                                    <i className={"material-icons " + classes.icon}>person</i>
                                </div>
                                <div className={'col-8'}>
                                    <h4 className="h6 font-weight-light">Username</h4>
                                    <input type="text" className={classes.input + " h5 text-capitalize"} onChange={this.nameChanged} value={this.state.userData.username} />
                                </div>
                                <div className={'col-2 text-center text-secondary'}>
                                    <button className="btn btn-outline-dark btn-sm"><i className={"material-icons md-24"}>check</i></button>
                                </div>
                            </form>
                            <div className={'row no-gutters mb-2 bg-white'}>
                                <div className={'col-2 text-center text-info'}>
                                    <i className={"material-icons " + classes.icon}>phone</i>
                                </div>
                                <div className={'col-8'}>
                                    <h4 className="h6 font-weight-light">Phone number</h4>
                                    <h4 className="h5">{this.state.userData.phoneNumber ? this.state.userData.phoneNumber : " + Add phone number"}</h4>
                                </div>
                                <div className={'col-2 text-center text-secondary'}>
                                    <i className={"material-icons md-24"}>edit</i>
                                </div>
                            </div>
                            <div className={'row no-gutters mb-2 bg-white'}>
                                <div className={'col-2 text-center text-success'}>
                                    <i className={"material-icons " + classes.icon}>home</i>
                                </div>
                                <div className={'col-8'}>
                                    <h4 className="h6 font-weight-light">Home address</h4>
                                    <h4 className="h5">{this.state.userData.address ? this.state.userData.address : " + Add home address"}</h4>
                                </div>
                                <div className={'col-2 text-center text-secondary'}>
                                    <i className={"material-icons md-24"}>edit</i>
                                </div>
                            </div>
                            <div className={'row no-gutters mb-2 bg-white'}>
                                <div className={'col-2 text-center text-warning'}>
                                    <i className={"material-icons " + classes.icon}>face</i>
                                </div>
                                <div className={'col-8'}>
                                    <h4 className="h6 font-weight-light">Gender</h4>
                                    <h4 className="h5">{this.state.userData.gender ? this.state.userData.gender : "Not set"}</h4>
                                </div>
                                <div className={'col-2 text-center text-secondary'}>
                                    <i className={"material-icons md-24"}>edit</i>
                                </div>
                            </div>
                            <div className={'row no-gutters mb-2 bg-white'}>
                                <div className={'col-2 text-center text-danger'}>
                                    <i className={"material-icons " + classes.icon}>cake</i>
                                </div>
                                <div className={'col-8'}>
                                    <h4 className="h6    font-weight-light">Date of birth</h4>
                                    <h4 className="h5">{this.state.userData.birthday ? this.state.userData.birthday : "Not set"}</h4>
                                </div>
                                <div className={'col-2 text-center text-secondary'}>
                                    <i className={"material-icons md-24"}>edit</i>
                                </div>
                            </div>
                        </React.Fragment>
                        }

                    </div>
                </div>
            </div>
        )
    }
}