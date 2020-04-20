import React, { Component } from "react";
import classes from "./Home.css";
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import img from '../../assets/Image/logo/logo_red.png'
import 'firebase/auth';

class Home extends Component {
  state = {
    userData: null
  }
  componentDidMount() {

    document.title = "Skychat homepage";
    this.checkUser()
  }

  checkUser = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userdata = {
          username: user.displayName,
          profilePicture: user.photoURL
        }
        this.setState({ userData: userdata })
        this.props.history.push('/feed')
      }
    })
  }

  render() {
    return (
      <div className={classes.home} id="page-top">
        <header className={classes.masthead}>
          <div className="container h-100">
            <div className="row h-100">
              <div className="col-lg-7 my-auto">
                {this.state.userData ? <div className=" py-4 mx-auto d-flex text-light align-items-center justify-content-center">
                  <img style={{ height: "5rem", flexShrink: 0, width: "5rem", objectFit: "cover" }} src={this.state.userData.profilePicture} className="bg-light rounded-circle " alt="" />
                  <div className="text-light px-3 ">

                    <h4 className="text-light h6">{this.state.userData.username} is already logged in</h4>
                    <Link to={"/" + this.state.userData.username} className="btn btn-outline-light px-3 btn-sm  rounded-pill">Continue as {this.state.userData.username}</Link>
                  </div>
                </div>
                  : null}
                <div className={classes.header_content + " mx-auto"}>
                  <h1 >Welcome to skychat</h1>
                  <img src={'logo.png'} />
                  <div className={classes.buttons}>
                    <Link style={{ color: 'white' }} to="/SignUp" className="btn btn-warning px-5  rounded-pill">Sign up</Link>

                    <Link to="/login" className="btn btn-light px-5  rounded-pill">Login </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>


      </div>
    );
  }
}

export default Home;
