import React, { PureComponent } from 'react';
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';

import './TemplateCard.scss';

import { RkExperimentTemplateInfo } from 'models';
import { formatDate } from 'helpers/dateFormatter';

@observer
export class TemplateCard extends PureComponent<{ template: RkExperimentTemplateInfo, onOpenTemplate: (templateId: string) => void }> {

    handleOpenTemplate = () => {
        this.props.onOpenTemplate(this.props.template.rkExperimentTemplateId);
    }

    render() {
        return (
            <div className='template-card'>
                <Card border='info'>
                    <Card.Body>
                        <Card.Title>{this.props.template.name}</Card.Title>
                        <Card.Subtitle className='mb-2 text-muted'>Автор: {this.props.template.ownerName}</Card.Subtitle>
                        <Card.Text>{this.props.template.description}</Card.Text>
                    </Card.Body>
                    <ListGroup className='list-group-flush'>
                        <ListGroupItem><i>Создан: {formatDate(this.props.template.createdAt)}</i></ListGroupItem>
                        <ListGroupItem><i>Изменен: {formatDate(this.props.template.modifiedAt)}</i></ListGroupItem>
                    </ListGroup>
                    <Card.Body className='card-link'>
                        <Button variant='info' onClick={this.handleOpenTemplate}>Открыть</Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}