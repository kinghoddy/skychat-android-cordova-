import React from 'react';
import classes from './display.css'
const Display = props => {
    const light = `:root { --blue: #007bff; --indigo: #6610f2; --purple: #6f42c1; --pink: #e83e8c; --red: #dc3545; --orange: #fd7e14; --yellow: #ffc107; --green: #28a745; --teal: #20c997; --cyan: #17a2b8; --white: #fff; --gray: #eee; --black: #000; --gray-dark: #777; --primary: #007bff; --secondary: #ddd; --success: #28a745; --info: #17a2b8; --warning: #ffc107; --danger: #dc3545; --light: #f9f9f9; --dark: #343a40; --breakpoint-xs: 0; --breakpoint-sm: 576px; --breakpoint-md: 768px; --breakpoint-lg: 992px; --breakpoint-xl: 1200px; --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }`;
    const dark = `:root { --blue: #007bff; --indigo: #6610f2; --purple: #6f42c1; --pink: #e83e8c; --red: #fbeaec; --orange: #fd7e14; --yellow: #ffc107; --green: #28a745; --teal: #20c997; --cyan: #17a2b8; --white: #171e25; --gray: #101010; --gray-dark: #aaa; --primary: #007bff; --secondary: #777; --success: #28a745; --info: #17a2b8; --warning: #ffc107; --danger: #dc3545; --light: #11161b; --dark: #f7f7f7; --black: #fff; --breakpoint-xs: 0; --breakpoint-sm: 576px; --breakpoint-md: 768px; --breakpoint-lg: 992px; --breakpoint-xl: 1200px; --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }`;

    let theme = localStorage.getItem('skychatTheme');
    let domeTheme = light
    if (theme === null) {
        localStorage.setItem('skychatTheme', 'light')
    } else if (theme === 'dark') {
        domeTheme = dark
    }
    console.log(theme);
    const style = document.getElementById('style')
    style.innerHTML = domeTheme



    return (
        <div className="bg-white p-4">
            <h4>Theme</h4>
            <div className="d-flex">

                <div onClick={() => {
                    localStorage.setItem('skychatTheme', 'light')
                    style.innerHTML = light
                }} className={classes.theme}></div>
                <div onClick={() => {
                    localStorage.setItem('skychatTheme', 'dark')
                    style.innerHTML = dark
                }
                } className={classes.theme + ' mx-3'}></div>
            </div>
        </div>
    )

}

export default Display