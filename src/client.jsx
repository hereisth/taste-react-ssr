import React from 'react';
import ReactDOM from 'react-dom/client';
import Counter from './Counter';

ReactDOM.hydrateRoot(document.getElementById('root'), React.createElement(Counter));