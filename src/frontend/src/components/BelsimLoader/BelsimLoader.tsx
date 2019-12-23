import * as React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

import './BelsimLoader.scss';

export class BelsimLoader extends React.PureComponent {

    render() {
        return (
            <div className='belsim-loader'>
                <ScaleLoader
                    height={70}
                    width={8}
                    color={"#138496"}
                    loading={true}
                />
            </div>
        );
    }
}