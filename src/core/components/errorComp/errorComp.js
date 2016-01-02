import React from 'react';
import { Alert } from 'react-bootstrap';


export function ErrorComp({messages}) {

  return (messages && messages.length) ? (
    <Alert bsStyle='danger' style={{marginTop: 10}}>
      <ul>
        {
          messages.map( (m,i) => {
            return (
              <li key={i}> {m.message} </li>
            );
          })
        }
      </ul>
    </Alert>
  ) : (<noscript />) ;
}

