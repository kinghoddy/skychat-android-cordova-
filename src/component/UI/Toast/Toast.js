import React from 'react';
import classes from './Toast.css';

export default props => {
    return (
        <div className={classes.toast + " rounded-pill"}>
            {props.children}
        </div>
    )
}