import React, { useState } from 'react';
import classes from './post.css';
import firebase from '../../../firebase';
import { Link } from 'react-router-dom';
export default props => {
    let date = 'Dec 12 2019 at 5:30pm'
    var weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    var now = new Date(props.date);
    var month = months[now.getMonth()];
    var year = now.getFullYear();
    var monthDay = now.getDate();
    var week = weekDays[now.getDay()];
    var hour = now.getHours();
    var min = dec(now.getMinutes());
    var lastTime = now.getTime();
    var clock = " am";
    if (hour > 12) {
        clock = " pm";
        hour -= 12
    }
    function dec(num) {
        if (num < 10) return "0" + num;
        else return num;
    }
    var current = new Date()

    if (current.getDate() === monthDay) {
        date = "Today at " + hour + ":" + min + clock;
    } else if ((current.getDate() - monthDay === 1) || (current.getDate() - monthDay === -30)) {
        date = "Yesterday at " + hour + ":" + min + clock;
    } else if (
        current.getDate() - monthDay > 1 &&
        current.getDate() - monthDay < 7
    ) {
        date = week + " at " + hour + ":" + min + clock;
    } else if (year === current.getFullYear()) {
        date =
            month + " " + monthDay + " at " + monthDay + " " + hour + ":" + min + clock;
    } else if (year > current.getFullYear()) {
        date =
            month +
            " " +
            monthDay +
            " " +
            year +
            " at " +
            hour +
            ":" +
            min +
            clock;
    } else {
        date = week + '  ' + hour + ':' + min + clock
    }

    const [showBtn, setShowBtn] = useState(false)
    const like = () => {
        const ref = firebase.database().ref('posts/' + props.id + "/likes/" + props.likeeId)
        if (props.liked) {
            ref.set(null).then(() => {

            })
        } else {
            ref.set(Date.now()).then(() => {
            })
        }
    }
    let likes = []
    if (props.likes) {
        for (let keys in props.likes)
            firebase.database().ref('users/' + keys).on('value', s => {
                let user = s.val()
                likes.push(user)
            })
    }
    const lastLike = likes[likes.length - 1]
    let video = React.createRef()

    window.addEventListener('scroll', () => {
        let videos = video.current
        if (videos !== null) {
            if (videos.getBoundingClientRect().top <= 300 && videos.getBoundingClientRect().top > 0) {
                videos.play()
            } else {
                videos.pause()
            }

        }

        // console.log(video.current.getClientBoundingTriangle());

    })
    const [value, changed] = useState('')


    return (
        <div className={classes.Post + " mb-3 bg-white"} >
            <div className="d-flex align-items-center px-3 py-2">
                <Link to={"/" + props.uid}>
                    <img src={props.icon} alt="" className={classes.icon + " border rounded-circle"} />
                </Link>
                <div className="px-3">

                    <h4 className={classes.coprate + " h6"}>{props.username}</h4>
                    <p className={classes.date}>{date}</p>
                </div>
                <i className={classes.moreCon + " material-icons ml-auto"}>more_vert</i>
                <div className={classes.more}>
                    {props.isMine ? <button onClick={props.deletePost} >Delete post</button> : null}
                </div>
            </div>
            {props.title ?
                <h1 className={classes.title + " h3 px-4 py-2 "}>{props.title}</h1> : null}
            {props.body ? <p className="px-3 pb-2" dangerouslySetInnerHTML={{ __html: props.body }}>
            </p> : null
            }
            {
                props.type ? <div className={classes.con}>
                    {props.type === 'images' ?
                        <img alt="" src={props.src} className="border-0" />
                        : null}
                    {props.type === 'video' ?
                        <video ref={video} controls loop src={props.src}></video>
                        : null}
                </div> : null
            }

            <form onSubmit={(e) => { changed(''); setShowBtn(false); props.postComment(e, value) }} className={classes.btnCon + "  d-flex align-items-center px-2 "}>
                <input onBlur={() => {
                    if (!value) {
                        setShowBtn(false)
                    }
                }} onFocus={() => {
                    setShowBtn(true)
                }} type="text" placeholder="Comment....." className={classes.comment} value={value} onChange={(e) => { changed(e.target.value) }} required />
                {showBtn ? <button className={classes.btn} type="submit" >
                    <i className="material-icons " >chat_bubble_outline</i>
                </button> : <React.Fragment>
                        <button type="button" style={{ color: props.liked ? 'red' : null }} className={classes.btn} onClick={like}>
                            <i className="material-icons ">{props.liked ? 'favorite' : 'favorite_border'}</i>
                            {/* Like */}
                        </button>


                        <button type="button" className={classes.btn}>
                            <i className="material-icons ">share</i>
                            {/* Share */}
                        </button>
                    </React.Fragment>}
            </form>
            <div className="d-flex px-3  align-items-center ">

                {lastLike ?
                    <span className="">
                        Liked by  <strong className="text-capitalize px-1"> {lastLike.username} </strong>  {likes.length - 1 > 0 ? <React.Fragment>and <strong className=" px-1"> {likes.length - 1} </strong> other(s)</React.Fragment> : null}
                    </span> : null}
            </div>
            {props.comments ? <div className=" px-3 pb-2 ">

                <React.Fragment>
                    <span className="pb-3 d-block">{props.comments.length} comment((s))</span>
                    {props.comments.map(cur => (

                        <div className={classes.comments_box} key={cur.comment + cur.uid}>
                            <img src={cur.profilePicture} alt="" />
                            <div>
                                <h5 className="text-capitalize">{cur.username}</h5>
                                <p>{cur.comment}</p>
                            </div>
                        </div>
                    ))}
                </React.Fragment>

            </div>
                : null}
        </div >

    )

}