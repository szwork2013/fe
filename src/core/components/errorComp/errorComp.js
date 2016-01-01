import React from 'react';
import { Alert } from 'react-bootstrap';


export function ErrorComp({messages}) {

  return (messages && messages.length) ? (
    <Alert bsStyle='danger' style={{marginTop: 10}}>
      <ul>
        {
          messages.map(m => {
            return (
              <li> {m.message} </li>
            );
          })
        }
      </ul>
    </Alert>
  ) : (<noscript />) ;
}

