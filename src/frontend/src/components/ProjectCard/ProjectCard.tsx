import React, { PureComponent } from 'react';
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';

import { Project } from 'models';
import './ProjectCard.scss';

export class ProjectCard extends PureComponent<{ project: Project, onOpenProject: (projectId: string) => void }> {

    constructor(props) {
        super(props);
    }

    handleOpenProject = () => {
        this.props.onOpenProject(this.props.project.ProjectId);
    }

    render() {
        return (
            <div className='project-card'>
                <Card border="info">
                    <Card.Body>
                        <Card.Title>{this.props.project.ProjectName}</Card.Title>
                        <Card.Subtitle className='mb-2 text-muted'>{this.props.project.OrganizationName}</Card.Subtitle>
                        <Card.Text>{this.props.project.Comments}</Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>Создан: <i>{this.props.project.CreatedAt.toLocaleString('ru-RU')}</i></ListGroupItem>
                        <ListGroupItem>Изменен: <i>{this.props.project.ModifiedAt.toLocaleString('ru-RU')}</i></ListGroupItem>
                    </ListGroup>
                    <Card.Body className="card-link">
                        <Button variant='info' onClick={this.handleOpenProject}>Открыть</Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}