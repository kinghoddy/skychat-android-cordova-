import React from "react";
import classes from "./User.css";
import { Route } from "react-router-dom";

import Login from "../../component/Forms/Login/Login";
import Signin from "../../component/Forms/SignUp/SignUp";
import Logo from "../../component/Logo/Logo";
const Account = props => {
  var metaThemeColor = document.querySelector("meta[name=theme-color]");
  metaThemeColor.setAttribute("content", "var(--white)");

  return (
    <div className={"container-fluid " + classes.Account}>
      <div className="row no-gutter">
        <div
          className={
            "  col-md-4 col-lg-6 d-none d-md-flex align-items-center " +
            classes.bgImage
          }
        ></div>
        <div className={classes.login + " col-md-8 px-0 bg-white col-lg-6"}>
          <div className={"h-100 d-flex align-items-center py-4 "}>
            <div className="container">
              <div className="row">
                <div className="col-md-9   col-lg-8 mx-auto">
                  <Logo type="l1" width="90%" />
                  <div className="px-3 my-4">
                    {props.location.pathname === "/login" ? (
                      <h3>Welcome back !</h3>
                    ) : (
                      <h5>Get started with us today ! </h5>
                    )}
                  </div>
                  <Route path="/signUp" component={Signin} />
                  <Route path="/login" component={Login} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
