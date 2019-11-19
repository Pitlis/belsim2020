import * as React from "react";
import { observer } from "mobx-react";
import { FormControl, InputFormControl } from "@quantumart/mobx-form-validation-kit";

import './BelsimInput.scss';
import errorMessages from "helpers/errorMessages";

interface Props {
    formControl: FormControl;
    inputType: 'text' | 'email' | 'password' | 'number';
    showErrors: boolean;
    fieldName: string;
    description?: string;
}

@observer
export class BelsimInput extends React.Component<Props> {
    render() {
        return (
            <div className='form-group belsim-input'>
                <label className='form-label'>{this.props.fieldName}</label>
                <input
                    type={this.props.inputType}
                    {...InputFormControl.bindActions(this.props.formControl)}
                    value={this.props.formControl.value}
                    className={`form-control ${this.props.showErrors && this.props.formControl.errors.length ? 'invalid-input': ''}`}
                />
                {this.props.description ? (<small className='text-muted form-text'>{this.props.description}</small>) : (null)}
                {this.props.showErrors ? (this.props.formControl.errors.map(error => (
                    <div key={error.message} className='error'>
                        {errorMessages[error.message]}
                    </div>
                ))) : (null)}
            </div>
        );
    }
}