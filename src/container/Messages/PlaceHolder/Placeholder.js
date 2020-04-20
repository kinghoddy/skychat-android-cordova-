import React from 'react';
import Logo from '../../../component/Logo/Logo'

const placeHolder = props => {
    return (
        <div className="h-100 w-100 d-flex align-items-center justify-content-center">
            <div className="rounded-circle d-flex align-items-center" style={{
                background: "rgba(255,255,255,.5)",
                height: "20rem",
                width: "20rem"
            }}>
                <div className="mx-auto">

                    <Logo type='l4' height="5rem" />
                    <h3 className="mt-3 text-center">Start a chat</h3>
                </div>

            </div>
        </div>
    )
}

export default placeHolder