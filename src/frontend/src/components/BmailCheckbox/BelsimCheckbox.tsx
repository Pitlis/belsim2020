import * as React from "react";
import { observer } from "mobx-react";
import { FormControl, InputFormControl } from "@quantumart/mobx-form-validation-kit";

import 'pretty-checkbox/src/pretty-checkbox.scss';
import './BelsimCheckbox.scss';

interface Props {
    formControl: FormControl<boolean>;
    showErrors: boolean;
    fieldName: string;
    description?: string;
    name: string;
}

@observer
export class BelsimCheckbox extends React.Component<Props> {

    handleCheckbox = (ev) => {
        this.props.formControl.setValue(ev.target.checked);
    }

    render() {
        return (
            <div className='form-group belsim-checkbox pretty p-default'>
                <input
                    type="checkbox"
                    {...InputFormControl.bindActions(this.props.formControl as FormControl<any>)}
                    checked={this.props.formControl.value}
                    className={`${this.props.showErrors && this.props.formControl.errors.length ? 'invalid-input' : ''}`}
                    id={this.props.name}
                    onChange={this.handleCheckbox}
                />
                <div className='form-label state p-primary'>
                    <label htmlFor={this.props.name}>{this.props.fieldName}</label>
                </div>
                {this.props.description ? (<small className='text-muted form-text'>{this.props.description}</small>) : (null)}
                {this.props.showErrors ? (this.props.formControl.errors.map(error => (
                    <div key={error.message} className='error'>
                        {error.message}
                    </div>
                ))) : (null)}
            </div>
        );
    }
}