import React, { Component } from 'react';
import Input from '../../UI/Input/Input'

export default class Search extends Component {
    state = {
        form: {
            search: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Search for a user",
                    required: true
                },
                value: "",
                id: 'search',
                label: "Search for a user"
            }
        }
    }
    inputChanged = (e, id) => {
        const updatedForm = {
            ...this.state.form
        };
        const updatedFormEl = { ...updatedForm[id] };
        updatedFormEl.value = e.target.value;
        updatedForm[id] = updatedFormEl;
        this.setState({ form: updatedForm });
    };
    render() {
        const formElementArray = [];
        for (let key in this.state.form) {
            formElementArray.push({
                id: key,
                config: this.state.form[key]
            });
        }
        return (
            <form onSubmit={this.props.submit}>
                {formElementArray.map(el => (
                    <Input
                        elementType={el.config.elementType}
                        elementConfig={el.config.elementConfig}
                        value={el.config.value}
                        id={el.id}
                        key={el.config.id}
                        label={el.config.label}
                        changed={e => {
                            this.inputChanged(e, el.id);
                        }} />
                ))}
            </form>
        )
    }

}