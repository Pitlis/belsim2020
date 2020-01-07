import React, { PureComponent } from 'react';
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';

import './ProjectCard.scss';

import { Project } from 'models';
import { formatDate } from 'helpers/dateFormatter';

@observer
export class ProjectCard extends PureComponent<{ project: Project, onOpenProject: (projectId: string) => void }> {

    handleOpenProject = () => {
        this.props.onOpenProject(this.props.project.projectId);
    }

    render() {
        return (
            <div className='project-card'>
                <Card border='info'>
                    <Card.Body>
                        <Card.Title>{this.props.project.projectName}</Card.Title>
                        <Card.Subtitle className='mb-2 text-muted'>{this.props.project.organizationName}</Card.Subtitle>
                        <Card.Text>{this.props.project.comments}</Card.Text>
                    </Card.Body>
                    <ListGroup className='list-group-flush'>
                        <ListGroupItem><i>Создан: {formatDate(this.props.project.createdAt)}</i></ListGroupItem>
                        <ListGroupItem><i>Изменен: {formatDate(this.props.project.modifiedAt)}</i></ListGroupItem>
                    </ListGroup>
                    <Card.Body className='card-link'>
                        <Button variant='info' onClick={this.handleOpenProject}>Открыть</Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}