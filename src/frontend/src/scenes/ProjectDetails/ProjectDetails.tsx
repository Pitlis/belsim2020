import React, { Component } from 'react';
import { observer } from 'mobx-react';


@observer
export class ProjectDetails extends Component {

    public render(): JSX.Element {
        return (
            <div>Some project details</div>
        );
    }
}