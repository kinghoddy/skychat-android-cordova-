import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router-dom';

import Modal from './component/UI/BtModal/BtModal';
import Toast from './component/UI/Toast/Toast';
import Messages from './container/Messages/Messages'
import Edit from './container/Edit/Edit'
import Home from './container/Home/Home'
import Profile from './container/Profile/Profile'
import User from './container/User/User'

class App extends Component {
  state = {
    toast: null
  }
  componentDidMount() {
    // this.checkOnlineState()
    // this.messageing()
    const light = `:root { --blue: #007bff; --indigo: #6610f2; --purple: #6f42c1; --pink: #e83e8c; --red: #dc3545; --orange: #fd7e14; --yellow: #ffc107; --green: #28a745; --teal: #20c997; --cyan: #17a2b8; --white: #fff; --gray: #eee; --black: #000; --gray-dark: #777; --primary: #007bff; --secondary: #ddd; --success: #28a745; --info: #17a2b8; --warning: #ffc107; --danger: #dc3545; --light: #f9f9f9; --dark: #343a40;  }`;
    const dark = `:root { --blue: #007bff; --indigo: #6610f2; --purple: #6f42c1; --pink: #e83e8c; --red: #fbeaec; --orange: #fd7e14; --yellow: #ffc107; --green: #28a745; --teal: #20c997; --cyan: #17a2b8; --white: #171e25; --gray: #101010; --gray-dark: #aaa; --primary: #007bff; --secondary: #777; --success: #28a745; --info: #17a2b8; --warning: #ffc107; --danger: #dc3545; --light: #11161b; --dark: #f7f7f7; --black: #fff;  }`;

    let theme = localStorage.getItem('skychatTheme');
    // const StatusBar = window.StatusBar
    // StatusBar.overlaysWebView(true);
    // StatusBar.styleLightContent();
    // StatusBar.styleBlackOpaque();
    // StatusBar.styleDefault();
    let domeTheme = dark
    var metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (theme === null) {
      localStorage.setItem('skychatTheme', 'light')
    } else if (theme === 'dark') {
      domeTheme = dark
      metaThemeColor.setAttribute("content", ' #171e25');
      // StatusBar.styleBlackTranslucent();
    }
    else if (theme === 'light') {
      metaThemeColor.setAttribute("content", ' #fff');
      domeTheme = light
      // StatusBar.styleDefault();

    }
    console.log(theme);
    const style = document.getElementById('style')
    style.innerHTML = domeTheme

    let hasUsed = localStorage.getItem('hasUsedSkychat');
    if (hasUsed) {
      this.setState({ shouldRedirect: true })
    }
  }

  render() {

    return (
      <BrowserRouter>
        {window.innerWidth < 1200 ?
          <Modal show={false} click={this.toggleFullscreen} btn="Toggle Fullscreen">
            This app is best enjoyed in fullscreen
        </Modal> : null
        }
        <style id="style"></style>
        {this.state.toast ? <Toast>{this.state.toast}</Toast> : null}
        <Switch>
          {/* {this.state.shouldRedirect ? <Redirect exact from="/" to="/feed" /> : null} */}
          <Route path="/login" exact component={User} />
          <Route path="/signUp" exact component={User} />
          <Route path="/messages/:chatId" component={Messages} />
          <Route path="/messages/" component={Messages} />
          <Redirect from='/undefined' to='/' />
          <Route path="/notifications" exact component={Profile} />
          <Route path="/menu" component={Profile} />
          <Route path="/feed" component={Profile} />
          <Route path="/edit-profile" component={Edit} />
          <Route path="/:profile" exact component={Profile} />
          <Route path="/" component={Home} />
          <Route render={() => (<h1>Not found</h1>)} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
