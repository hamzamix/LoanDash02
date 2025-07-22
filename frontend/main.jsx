import React from 'react';
import ReactDOM from 'react-dom/client';

fetch('/api/data')
  .then(res => res.json())
  .then(data => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <>
        <h1>LoanDash</h1>
        <ul>
          {data.loans.map(loan => (
            <li key={loan.id}>{loan.borrower}: ${loan.amount}</li>
          ))}
        </ul>
      </>
    );
  });
