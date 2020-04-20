import React, { Component } from 'react';

import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';


class Layout extends Component {

    render() {
        return (
            <div className={classes.Layout}>
                <Toolbar profile={this.state.profileData.username} />
            </div >
        )
    }
}

export default Layout