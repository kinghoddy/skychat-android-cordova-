import React, { Component } from 'react';


class Modal extends Component {


    componentDidMount() {
        if (this.props.show) {
            document.getElementById('mBtn').click()
        }
    }

    render() {

        return (
            this.props.show ? <React.Fragment>

                <button type="button" id='mBtn' className="d-none" data-toggle="modal" data-target="#modelId">
                    Launch
         </button>

                <div className="modal fade" id="modelId" tabIndex="-1" role="dialog" >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {this.props.children}
                            </div>
                            {this.props.btn ?
                                <div className="modal-footer">
                                    <button onClick={this.props.click} style={{
                                        background: 'orangered',
                                        color: 'white'
                                    }} type="button" className="btn">{this.props.btn}</button>
                                </div> : null
                            }

                        </div>
                    </div>
                </div>
            </React.Fragment> : null

        )
    }
}

export default Modal;