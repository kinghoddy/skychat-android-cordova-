import React from 'react';

import Logo1 from '../../assets/Image/logo/skychat_red.png';
import Logo2 from '../../assets/Image/logo/skychat_blue.png';
import Logo3 from '../../assets/Image/logo/logo_red.png';
import Logo4 from '../../assets/Image/logo/logo_blue.png';
import Logo5 from '../../assets/Image/logo/skychat_light_1.png';
import Logo6 from '../../assets/Image/logo/skychat_light_2.png';
import classes from './Logo.css';

const logo = (props) => {

    if (props.type === 'l1') {
        return (<div className={classes.Logo} style={{ height: props.height, width: props.width }}>
            <img src={Logo1} alt="skychat Logo1" />
        </div>)
    } else if (props.type === 'l2') {
        return (<div className={classes.Logo} style={{ height: props.height, width: props.width }}>
            <img src={Logo2} alt="skychat Logo" />
        </div>)

    } else if (props.type === 'l3') {
        return (<div className={classes.Logo} style={{ height: props.height, width: props.width }}>
            <img src={Logo3} alt="skychat Logo" />
        </div>)

    } else if (props.type === 'l4') {
        return (<div className={classes.Logo} style={{ height: props.height, width: props.width }}>
            <img src={Logo4} alt="skychat Logo" />
        </div>)

    } else if (props.type === 'l5') {
        return (<div className={classes.Logo} style={{ height: props.height, width: props.width }}>
            <img src={Logo5} alt="skychat Logo" />
        </div>)

    } else if (props.type === 'l6') {
        return (<div className={classes.Logo} style={{ height: props.height, width: props.width }}>
            <img src={'res/logo/skychat_light_2.png'} alt="skychat Logo" />
        </div>)
    } else {
        return <h5>Cant load logo</h5>
    }

}


export default logo;