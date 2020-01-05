import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import './ShipmentsEditor.scss';

import { TemplateStore, StoresType } from 'stores';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class ShipmentsEditor extends Component<{ stores?: StoresType }> {
    public templateStore: TemplateStore;

    constructor(props) {
        super(props);
        this.templateStore = this.props.stores!.TemplateStore;
    }

    componentWillUnmount() {
    }

    public render(): JSX.Element {
        return (
            <div className='shipments-editor'>
                shipments editor
            </div>
        );
    }
}