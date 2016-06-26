import React from 'react';
import ReactDOM from 'react-dom';
import NestedLink from './index';
import style from './example.css';

const container = document.createElement('div');
document.body.appendChild(container);

function Example() {
  return (
    <div>
      <a href="#/one">
        One{' '}
        <NestedLink href="#/two">
          Two{' '}
          <NestedLink href="#/three">
            Three{' '}
            <NestedLink href="#/four">
              Four{' '}
            </NestedLink>
          </NestedLink>
        </NestedLink>
      </a>
    </div>
  );
}

ReactDOM.render(<Example />, container);
