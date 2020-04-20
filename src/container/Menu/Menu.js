import React, { Component } from "react";
import firebase from "../../firebase";
import "firebase/auth";
import Spinner from "../../component/UI/Spinner/Spinner";
import { Link, Redirect, Route } from "react-router-dom";
import classes from "./Menu.css";

import Friends from "../../component/Friends/Friends";
import Requests from "../../component/Friends/Request";
import Display from '../../component/Display/Display'

class Menu extends Component {
  state = {
    loading: false,
    shouldLogout: false,
    userData: {
      profilePicture: "",
      username: "",
      uid: ""
    }
  };
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ loading: true });
      if (user) {
        const userdata = {
          ...this.state.userData
        };
        userdata.profilePicture = user.photoURL;
        userdata.uid = user.uid;
        userdata.username = user.displayName.toLowerCase();
        document.title =
          user.displayName +
          " Skychat | Menu" +
          this.setState({
            loading: false,
            shouldLogout: false,
            userData: userdata
          });
      } else {
        this.setState({ shouldLogout: true, loading: false });
      }
    });

  }
  logOutHandler = () => {
    this.setState({ loading: true });
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.setState({ loading: false, shouldLogout: true });
      })
      .catch(error => {
        this.setState({ loading: false });
        console.log(error);
        // An error happened.
      });
  };
  render() {
    var menu = (
      <React.Fragment>
        <Link to="/edit-profile" className={classes.MenuLink + " row no-gutters"}>
          <div className="col-2 col-md-1 text-success">
            <i className="material-icons">edit</i>
          </div>
          <div className="col d-flex justify-content-between align-items-center">
            Edit profile
            <img
              src={this.state.userData.profilePicture}
              className=" rounded-circle"
              alt=""

            />
          </div>
        </Link>
        <Link
          to="/menu/friends"
          className={classes.MenuLink + " row no-gutters"}
        >
          <div className="col-2 col-md-1 text-primary">
            <i className="material-icons">people</i>
          </div>
          <div className="col">Friends</div>
        </Link>
        <Link
          to="menu/display-settings"
          className={classes.MenuLink + " row no-gutters"}>
          <div className="col-2 col-md-1 text-warning">
            <i className="material-icons">brightness_medium</i>
          </div>
          Display
      </Link>
        <Link
          to="/"
          className={classes.MenuLink + " row no-gutters"}>
          <div className="col-2 col-md-1 text-info">
            <i className="material-icons">help</i>
          </div>
          Help amd feedback
      </Link>
        <Link
          to="/login"
          onClick={this.logOutHandler}
          className={classes.MenuLink + " row no-gutters"}
        >
          <div className="col-2 col-md-1 text-danger">
            <i className="fa fa-door-open"></i>
          </div>
          Log out
        </Link>
      </React.Fragment>
    );
    if (this.state.shouldLogout) {
      menu = <Redirect to="/login?menu" />;
    }
    return this.state.loading ? (
      <Spinner />
    ) : (
        <div className="row no-gutters justify-content-center">
          <div className="col-lg-6 py-lg-4">
            <Route
              exact
              path="/menu"
              render={() => <React.Fragment>{menu}</React.Fragment>}
            />

            <Route
              exact
              path="/menu/display-settings"
              render={() => (
                <React.Fragment>
                  <Display />
                </React.Fragment>
              )}
            />
            <Route
              exact
              path="/menu/friends"
              render={() => (
                <React.Fragment>
                  <Friends uid={this.state.userData.uid} />
                  <Requests userData={this.state.userData} />
                </React.Fragment>
              )}
            />
          </div>
        </div>
      );
  }
}

export default Menu;
