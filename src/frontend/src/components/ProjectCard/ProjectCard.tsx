import React, { PureComponent } from 'react';
import './ProjectCard.scss';

export class ProjectCard extends PureComponent<{name: string}> {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="project-card">{this.props.name}</div>)
    }
}