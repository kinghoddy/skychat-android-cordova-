import React, { Component } from 'react'
import classes from './Profile.css';
import { Route, Switch } from 'react-router-dom'
import Toolbar from '../../component/Navigation/Toolbar/Toolbar';
import Alert from '../../component/UI/Alert/Alert';
import Timeline from './Timeline/Timeline';
import Notify from '../../component/Notify/Notify';
import Spinner from '../../component/UI/Spinner/Spinner';
import Menu from '../Menu/Menu';
import Feed from '../../component/feed/feed'


import firebase from '../../firebase';
import 'firebase/auth'


class Profile extends Component {
    state = {
        userData: {
            username: '',
        },

        isUser: false,
        loading: false,
        errorMessage: null,
        modalMessage: null
    }
    componentDidMount() {

        this.loadUserdata()
    }
    loadUserdata = () => {
        this.setState({ loading: true })
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const updatedUd = {
                    username: user.displayName.toLowerCase(),
                    email: user.email,
                    profilePicture: user.photoURL,
                    uid: user.uid
                }
                // fetch the profile data
                const userdata = {
                    ...this.state.userdata
                }
                for (let keys in updatedUd) {
                    userdata[keys] = updatedUd[keys]
                }
                this.setState({
                    userData: userdata, loading: false
                })
            } else {
                this.setState({ errorMessage: 'You are not logged in', loading: false })
                setTimeout(() => {
                    this.setState({ errorMessage: null })
                }, 1500)
            }
        })
    }
    render() {
        return (
            <div className={classes.Profile}>
                <Toolbar profile={this.props.match.params.profile} />


                {this.state.loading ?
                    <div style={{ height: '80vh' }}><Spinner style={{ background: 'var(--gray)' }} /> <p className={classes.brand}>skychat by odunmilade</p></div> : <React.Fragment>
                        {this.state.errorMessage ? <Alert type="danger" show={true}>{this.state.errorMessage}</Alert> : ''}

                        <Switch>
                            <Route path='/notifications' exact render={() => (
                                <Notify {...this.state} />)} />
                            <Route path='/feed' render={() => (<Feed {...this.state.userData} />)} />
                            <Route path='/menu' render={() => (<Menu {...this.props} />)} />
                            <Route path='/:profile' exact render={() => (<Timeline {...this.state} />)} />
                        </Switch>
                    </React.Fragment>
                }
            </div>
        )
    }
}

export default Profile

