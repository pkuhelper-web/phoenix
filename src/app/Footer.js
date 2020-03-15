import React from 'react';
import {useSelector} from 'react-redux';

import {SISTER_API_VER} from '../state/sister';

import './Footer.less';

export function Footer(props) {
    const backend_info=useSelector((state)=>state.backend ? state.backend.version : null);

    return (
        <div className="footer center">
            <p>
                Project <b>Fire Bird!</b> 基于&nbsp;
                <a href="https://www.gnu.org/licenses/gpl-3.0.zh-cn.html" target="_blank" rel="noopener noreferrer">GPLv3</a>
                &nbsp;在 <a href="https://github.com/pkuhelper-web/phoenix" target="_blank" rel="noopener noreferrer">GitHub</a> 开源
            </p>
            <p>Phoenix {process.env.REACT_APP_BUILD_INFO||'---'},  Bee {backend_info||'---'}, Sister {SISTER_API_VER}</p>
        </div>
    );
}

export function WithFooter(props) {
    return (
        <div className={props.no_classname ? '' :'with-footer-container'}>
            {props.children}
            <Footer />
        </div>
    )
}