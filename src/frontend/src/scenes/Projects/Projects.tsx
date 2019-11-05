import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Project } from 'models';
import { ProjectCard } from 'components/ProjectCard';


@observer
export class Projects extends Component {

    public render(): JSX.Element {
        let projects: Array<Project> = [
            new Project(),
            new Project()
        ];

        return (
            <div>
                {projects.map(p => <ProjectCard />)}
            </div>
        );
    }
}