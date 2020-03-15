import React from 'react';
import PropTypes from 'prop-types';

import './Layout.less';

export function SideHeaderLayout(props) {
    return (
        <div className="side-header-layout">
            <div className={'side-header-layout-header '+(props.headerClassName||'')} onClick={props.headerOnClick}>{props.header}</div>
            <div className="side-header-layout-main">{props.children}</div>
        </div>
    );
}
SideHeaderLayout.propTypes={
    header: PropTypes.node.isRequired,
    children: PropTypes.node,
    headerClassName: PropTypes.string,
    headerOnClick: PropTypes.func,
};

export function RightFader(props) {
    return (
        <div className="right-fader" />
    );
}