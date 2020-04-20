import React, { Component } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import Alert from "../../UI/Alert/Alert";

import firebase from "../../../firebase";
import "firebase/auth";
import "firebase/database";

import classes from "./SignUp.css";
import Input from "../../UI/Input/Input";
import google from "../../../assets/Image/google.png";
import Spinner from "../../UI/Spinner/Spinner";
import Picture from "../../../assets/Image/avatar-red.png";
import cover from "../../../assets/Image/avatar_square.png";

class Signin extends Component {
  state = {
    form: {
      username: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Username",
          required: true
        },
        value: "",
        id: "usernme",
        label: "Username"
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Email",
          required: true
        },
        value: "",
        id: "email",
        label: "Email"
      },
      password: {
        elementType: "input",
        elementConfig: {
          required: true,
          type: "password",
          placeholder: "Your password"
        },
        value: "",
        label: "Your password",
        id: "password"
      }
    },
    userData: {},
    uid: null,
    errorMessage: null,
    sMessage: null,
    loading: true
  };
  componentDidMount() {

    this.setState({ loading: false });
  }
  inputChanged = (e, id) => {
    const updatedForm = {
      ...this.state.form
    };
    const updatedFormEl = { ...updatedForm[id] };
    updatedFormEl.value = e.target.value;

    updatedForm[id] = updatedFormEl;

    this.setState({ form: updatedForm });
  };

  googleLogin = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    this.setState({ loading: true, sMessage: "Checking info  !" });
    firebase.auth().signInWithRedirect(provider).then(function () {
      return firebase.auth().getRedirectResult();
    }).then(result => {
      var user = result.user;
      this.saveUser(user);
    })
      .catch(error => {
        var errorMessage = error.message;
        this.setState({ errorMessage: errorMessage, loading: false });
      });
  };

  saveUser = user => {
    var ref = firebase.database().ref("users/");
    this.setState({ loading: true, sMessage: "Processing !" });
    ref.once("value", s => {
      const id = user.uid;
      if (s.val()[id]) {
        this.setState({
          loading: false,
          userExist: true,
          photo: s.val()[id].profilePicture,
          name: s.val()[id].username
        });
      } else {
        this.setState({ loading: true, sMessage: "Completing Signup  !" });
        ref
          .child(id)
          .set({
            username: user.displayName.toLowerCase(),
            coverPhoto: cover,
            profilePicture: user.photoURL
          })
          .then(() => {
            alert('then')
            this.setState({ loading: false, errorMessage: null, redirect: id });
          })
          .catch(() => {
            this.setState({
              loading: false,
              errorMessage: "Failed to save user to database"
            });
          });
      }
    });
  };
  signUpHandler = event => {
    event.preventDefault();
    this.setState({ loading: true, sMessage: "Checking info" });
    const formData = {};
    for (let formId in this.state.form) {
      formData[formId] = this.state.form[formId].value;
    }

    var ref = firebase.database().ref("users");

    ref.once("value", s => {
      this.setState({ sMessage: "Wait na  ..." });
      var usernameExist = false;
      for (let keys in s.val()) {
        if (
          formData.username.toLowerCase() ===
          s.val()[keys].username.toLowerCase()
        ) {
          usernameExist = true;
        }
      }
      if (usernameExist) {
        this.setState({
          errorMessage: (
            <span>
              Username <strong>{formData.username}</strong> Exists. Please{" "}
              <strong>Pick another username</strong>
            </span>
          ),
          loading: false
        });
      } else {
        firebase
          .auth()
          .createUserWithEmailAndPassword(formData.email, formData.password)
          .then(res => {
            var user = firebase.auth().currentUser;
            this.setState({ sMessage: "Please wait" });
            this.saveUser(user);
            user.updateProfile({
              displayName: formData.username.toLowerCase(),
              photoURL: Picture
            })
              .then(() => {
                // this.saveUser(user);
              })
              .catch(error => {
                // An error happened.
                const errorMessage = "Failed Authenticate";
                this.setState({ loading: false, errorMessage: errorMessage });
              });
          })
          .catch(error => {
            // Handle Errors here.
            var errorMessage = error.message;
            this.setState({ loading: false, errorMessage: errorMessage });
            // ...
          });
      }
    });
  };

  render() {
    const formElementArray = [];
    for (let key in this.state.form) {
      formElementArray.push({
        id: key,
        config: this.state.form[key]
      });
    }
    return this.state.loading ? (
      <Spinner message={this.state.sMessage} />
    ) : this.state.redirect ? <Redirect to={'/feed'} /> : this.state.userExist ? (
      <div className="d-flex flex-column justify-content-center">

        <img
          src={this.state.photo}
          alt=""
          className="rounded-circle mx-auto my-2"
          style={{ height: "5rem" }}
        />
        <p>
          An account was found for {this.state.name}. If this is you,{" "}
          <Link to="login">Proceed to login</Link> else{" "}
          <Link
            onClick={() => {
              this.setState({ userExist: false });
            }}
            to="SignUp"
          >
            Try again with another email
          </Link>{" "}
        </p>
      </div>
    ) : (
        <form onSubmit={this.signUpHandler}>
          {this.state.errorMessage ? (
            <Alert type="danger" show={true}>
              {this.state.errorMessage}
            </Alert>
          ) : (
              ""
            )}

          {formElementArray.map(el => (
            <Input
              elementType={el.config.elementType}
              elementConfig={el.config.elementConfig}
              value={el.config.value}
              id={el.id}
              key={el.config.id}
              label={el.config.label}
              changed={e => {
                this.inputChanged(e, el.id);
              }}
            />
          ))}

          <button
            className={
              classes.btnLogin +
              " btn btn-lg btn-block  wow fadeInUp  text-uppercase font-weight-bold mb-2"
            }
            type="submit"
          >
            Sign Up
        </button>
          <p className="text-center text-primary"> Or</p>
          <button
            className={classes.googleBtn + "  wow fadeInUp btn btn-lg btn-block  mb-2"}
            type="button"
            onClick={this.googleLogin}
          >
            <img
              src={google}
              alt=" "
              style={{ width: "2rem" }}
              className="mr-4"
            />
          Sign up with google
        </button>
          <div className="text-center  wow fadeInUpBig">
            <Link className="small" to="/login">
              Already have an accout, Login
          </Link>
          </div>
        </form>
      );
  }
}

export default withRouter(Signin);
