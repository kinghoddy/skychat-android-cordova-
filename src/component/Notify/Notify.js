import React, { Component } from 'react';
import Request from '../Friends/Request'
import Logo from '../../assets/Image/logo/logo_red.png'
import { Link } from 'react-router-dom';
import classes from './notify.css'


export default class Notify extends Component {
    state = {
        nots: [{
            icon: Logo,
            title: "Welcome to Skychat by king hoddy",
            description: "Created by odunmilade",
            button: null,
            link: "",
            seen: false
        }]
    }

    componentDidMount() {
        var metaThemeColor = document.querySelector("meta[name=theme-color]");
        metaThemeColor.setAttribute("content", '#f32');
    }
    render() {
        return (
            <div>
                <Request hideAll={true} userData={this.props.userData} />
                {this.state.nots.map(cur => {
                    return (
                        <Link
                            to={"/messages/" + cur.link}
                            className={
                                classes.nots +

                                " px-3 py-2 text-capitalize  border-bottom d-flex align-items-center" + (cur.seen ? ' bg-dark ' : " bg-dark ")
                            }
                            key={cur.link}
                        >
                            <div className={classes.picture}>
                                <img src={cur.icon} alt="chat Icon" />
                            </div>
                            <div style={{ minWidth: "11rem" }} className="ml-3 text-dark  ">
                                <h3 className=" font-weight-bold h5 m-0">
                                    {cur.title
                                        ? cur.title
                                            .split("<br/>")
                                            .join(" ")
                                            .substring(0, 20) +
                                        (Array.from(cur.title).length > 20 ? "..." : "")
                                        : null}
                                </h3>
                                <p className="m-0">
                                    {cur.description
                                        ? cur.description
                                            .split("<br/>")
                                            .join(" ")
                                            .substring(0, 21) +
                                        (Array.from(cur.description).length > 21 ? " ..." : "")
                                        : null}
                                </p>
                            </div>
                            <div className="text-right ml-auto">
                                <h6 style={{ color: "#888" }}>{cur.time}</h6>

                            </div>
                        </Link>

                    )
                })}
            </div>
        )
    }
}