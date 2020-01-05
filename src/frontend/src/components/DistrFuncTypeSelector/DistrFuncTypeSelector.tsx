import * as React from "react";
import { observer } from "mobx-react";

import './DistrFuncTypeSelector.scss';
import { DistrFuncTypes } from "models";
import Select from "react-select";

interface Props {
    value: DistrFuncTypes;
    onChange: (val: DistrFuncTypes) => void;
}

@observer
export class DistrFuncTypeSelector extends React.Component<Props> {
    render() {
        const options = [
            {
                value: DistrFuncTypes.Uniform,
                label: 'Равномерное'
            },
            {
                value: DistrFuncTypes.Exponential,
                label: 'Показательное'
            },
            {
                value: DistrFuncTypes.Normal,
                label: 'Нормальное'
            }
        ];

        return (
            <div className='dist-func-type-selector' >
                <div className='dist-func-type-selector-title'>Вид функции плотности распределения</div>
                <Select
                    options={options}
                    onChange={(ev: any) => this.props.onChange(ev.value)}
                    value={
                        this.props.value
                            ? options[this.props.value]
                            : options[0]
                    }
                />
            </div>
        );
    }
}