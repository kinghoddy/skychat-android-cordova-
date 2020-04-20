import React from 'react';
import { Link, NavLink, Route, Switch, withRouter } from 'react-router-dom';
import Logo from '../../Logo/Logo';
import classes from './Toolbar.css';
import firebase from '../../../firebase';
import 'firebase/auth';

const toolbar = props => {
    var profile = props.profile,
        shade = 'navbar-light',
        logoType = 'l6',
        bgColor = 'var(--white)';

    var user = firebase.auth().currentUser

    if (!profile) {
        if (user) {
            profile = user.uid
        }
    }

    window.addEventListener('scroll', () => {

    })
    if (props.location.pathname === '/notifications') {
        bgColor = '#f32';
        logoType = 'l6'
        shade = 'navbar-dark'
    } else {
        shade = 'navbar-light'
        bgColor = 'var(--white)'
        logoType = 'l1'
    }


    return (
        <React.Fragment>

            <nav style={{
                background: bgColor
            }} className={classes.Toolbar + "   navbar navbar-expand  fixed-top " + shade}>
                <div className="container-fluid h-100">
                    <Route path="/menu/:nest" render={() => (
                        <i style={{ cursor: "pointer" }} onClick={props.history.goBack} className=" material-icons px-3">arrow_back</i>
                    )} />
                    <Link to="/" className=" navbar-brand align-items-center d-flex p-0 pb-1 pl-lg-3 h-100">
                        {localStorage.getItem('skychatTheme') === 'dark' ? <Logo type={'l5'} width="7rem" /> : <Logo type={logoType} width="7rem" />}
                    </Link>
                    <div className="navbar-collapse collapse">
                        <ul className={"text-capitalize navbar-nav ml-auto "}>
                            {user ? <Link className="active ml-auto nav-link js-scroll-trigger" to={'/messages'}>
                                <i className="material-icons">chats</i>
                            </Link> : ''
                            }
                            <div className="d-none d-lg-inline-flex">
                                {user ? <li className="nav-item col-3 ">
                                    <NavLink activeClassName={classes.active} className="nav-link js-scroll-trigger" to={"/feed"}>
                                        <i className='material-icons'>home</i>
                                    </NavLink>
                                </li> : null}
                                <li className="nav-item col-3 ">
                                    <NavLink activeClassName={classes.active} className="nav-link js-scroll-trigger" to={"/" + profile}>
                                        <i className='material-icons'>account_circle</i>
                                    </NavLink>
                                </li>
                                {user ? <li className="nav-item col-3">
                                    <NavLink activeClassName={classes.active} className="nav-link js-scroll-trigger" to={'/notifications'}><i className='material-icons'>notifications</i>
                                    </NavLink>
                                </li> : ''}

                                {user ? <li className="nav-item col-3">
                                    <NavLink activeClassName={classes.active} className="nav-link js-scroll-trigger" to={'/menu'}>
                                        <i className='material-icons'>menu</i>
                                    </NavLink>
                                </li> : ''
                                }

                            </div>
                            {user ? '' : <Link className="ml-auto  nav-link js-scroll-trigger" to={'/login'}>
                                <button style={{
                                    background: 'orangered',
                                    color: 'white'
                                }} className="btn rounded-pill">Log in</button>
                            </Link>}
                        </ul>
                    </div>
                </div>
            </nav>
            <Switch>
                <Route path="/" exact />
                <Route render={() => (
                    <nav className={classes.Navbar + " fixed-bottom d-lg-none navbar navbar-expand navbar-light"}>
                        <div className="container-fluid navbar-collapse collapse p-0">
                            <ul className=" navbar-nav w-100 text-center " >
                                <li className="nav-item col-3 ">
                                    <NavLink activeClassName={classes.active} className="nav-link js-scroll-trigger" to={"/feed"}>
                                        <i className='material-icons'>home</i>
                                    </NavLink>
                                </li>
                                <li className="nav-item col-3 ">
                                    <NavLink activeClassName={classes.active} className="nav-link js-scroll-trigger" to={"/" + profile}>
                                        <i className='material-icons'>account_circle</i>
                                    </NavLink>
                                </li>
                                {profile ? <li className="nav-item col-3">
                                    <NavLink activeClassName={classes.active} className="nav-link js-scroll-trigger" to={'/notifications'}><i className='material-icons'>notifications</i>
                                    </NavLink>
                                </li> : ''}

                                {profile ? <li className="nav-item col-3">
                                    <NavLink activeClassName={classes.active} className="nav-link js-scroll-trigger" to={'/menu'}>
                                        <i className='material-icons'>menu</i>
                                    </NavLink>
                                </li> : ''}
                            </ul>
                        </div>
                    </nav>
                )} />
            </Switch>

        </React.Fragment >

    )
}

export default withRouter(toolbar)