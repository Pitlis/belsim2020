export enum HeaderMenuItemPosition {
    LEFT = 'left',
    RIGHT = 'right'
}

export class HeaderMenuItem {
    public title: string;
    public link: string;
    public position: HeaderMenuItemPosition;
    public isIcon?: boolean = false;
    public isActive?: boolean = false;
}