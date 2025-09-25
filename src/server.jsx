import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Counter from './Counter';

export default function render() {
  return ReactDOMServer.renderToString(<Counter />);
}