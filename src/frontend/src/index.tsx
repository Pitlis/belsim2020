import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import { stores, history } from 'stores';
import { App } from 'App';

// render react DOM
ReactDOM.render(
    <Provider {...stores}>
        <App history={history} />
    </Provider>,
    document.getElementById('root')
);