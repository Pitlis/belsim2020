import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
//import { Project } from 'models';

import { ProjectCard } from 'components/ProjectCard';
import { ProjectStore } from 'stores';

@inject(ProjectStore.name)
@observer
export class Projects extends Component<{ projectStore: ProjectStore }> {
    public projectStore: ProjectStore;

    constructor(props) {
        super(props);
        this.projectStore = props[ProjectStore.name];
    }

    componentDidMount() {
        this.projectStore.loadAvailableProjects();
    }

    handleAddProject = () => {
        this.projectStore.addProject();
    }

    public render(): JSX.Element {
        return (
            <div>
                <button onClick={this.handleAddProject}>Add project</button>
                {this.projectStore.availableProjects.map((p, i) => <ProjectCard key={i} name={p.ProjectName} />)}
            </div>
        );
    }
}