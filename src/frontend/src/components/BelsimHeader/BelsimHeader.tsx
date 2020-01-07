import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Navbar, Nav, Alert } from 'react-bootstrap';
import { FiGrid, FiLogOut } from "react-icons/fi";

import './BelsimHeader.scss';
import { StoresType, RouterStore, ErrorStore } from 'stores';
import { HeaderMenuItemPosition, HeaderMenuItem, BelsimError } from 'models';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class BelsimHeader extends Component<any> {
    public routerStore: RouterStore;
    public errorStore: ErrorStore;

    constructor(props) {
        super(props);
        this.routerStore = this.props.stores!.RouterStore;
        this.errorStore = this.props.stores!.ErrorStore;
    }

    onOpenLink = (path: string) => {
        this.routerStore.push(path);
    }

    render() {
        return (
            <>
                <Navbar className='belsim-header' expand='sm'>
                    <Navbar.Brand>BelSim 2020</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='mr-auto'>
                            {this.routerStore.HeaderMenuItems
                                .filter(menuItem => menuItem.position === HeaderMenuItemPosition.LEFT)
                                .map(menuItem => this.renderNavLink(menuItem))}
                        </Nav>
                    </Navbar.Collapse>
                    <Nav>
                        {this.routerStore.HeaderMenuItems
                            .filter(menuItem => menuItem.position === HeaderMenuItemPosition.RIGHT)
                            .map(menuItem => this.renderNavLink(menuItem))}
                    </Nav>
                </Navbar>
                <div className='errors'>
                    {this.errorStore.errors.map(e => this.renderError(e))}
                </div>
                <div className='content'>
                    {this.props.children}
                </div>
            </>
        );
    }

    handleCloseError = (errorId: string) => {
        this.errorStore.closeError(errorId);
    }

    private renderError(error: BelsimError): JSX.Element {
        return (
            <Alert key={error.errorId} variant='danger' onClose={() => this.handleCloseError(error.errorId)} dismissible>
                {error.message}
            </Alert>
        );
    }

    private renderIconByName(name: string): JSX.Element | null {
        switch (name) {
            case 'FiGrid':
                return <FiGrid size='1.5em' />;
            case 'FiLogOut':
                return <FiLogOut size='1.5em' />;
            default:
                return null;
        }
    }

    private renderNavLink(menuItem: HeaderMenuItem): JSX.Element {
        return (
            <Nav.Link
                onClick={() => this.onOpenLink(menuItem.link)}
                key={menuItem.link}
                className={menuItem.isActive ? 'active' : ''}
            >
                {menuItem.isIcon ? this.renderIconByName(menuItem.title) : menuItem.title}
            </Nav.Link>
        );
    }
}