import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Navbar, Nav } from 'react-bootstrap';
import { FiGrid, FiLogOut } from "react-icons/fi";

import './BelsimHeader.scss';
import { StoresType, RouterStore } from 'stores';
import { HeaderMenuItemPosition, HeaderMenuItem } from 'models';

@inject((stores: StoresType) => ({
    stores
}))
@observer
export class BelsimHeader extends Component<any> {
    public routerStore: RouterStore;

    constructor(props) {
        super(props);
        this.routerStore = this.props.stores!.RouterStore;
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
                            {/* <Nav.Link onClick={() => this.onOpenLink(routes.projects.path)}>Проекты</Nav.Link>
                            <Nav.Link href='#link'>Link</Nav.Link>
                            <NavDropdown title='Dropdown' id='basic-nav-dropdown'>
                                <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
                                <NavDropdown.Item href='#action/3.2'>Another action</NavDropdown.Item>
                                <NavDropdown.Item href='#action/3.3'>Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href='#action/3.4'>Separated link</NavDropdown.Item>
                            </NavDropdown> */}
                        </Nav>
                    </Navbar.Collapse>
                    <Nav>
                        {this.routerStore.HeaderMenuItems
                            .filter(menuItem => menuItem.position === HeaderMenuItemPosition.RIGHT)
                            .map(menuItem => this.renderNavLink(menuItem))}
                    </Nav>
                </Navbar>
                <div className='content'>
                    {this.props.children}
                </div>
            </>
        );
    }

    renderIconByName(name: string) {
        switch (name) {
            case 'FiGrid':
                return <FiGrid size='1.5em' />;
            case 'FiLogOut':
                return <FiLogOut size='1.5em' />;
            default:
                return null;
        }
    }

    renderNavLink(menuItem: HeaderMenuItem) {
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