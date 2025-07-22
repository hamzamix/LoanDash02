import React, { useEffect, useState } from 'react';
import LoanCard from './LoanCard.jsx';

export default function App() {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => setLoans(data.loans))
      .catch(() => setLoans([]));
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">LoanDash</h1>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loans.length ? (
          loans.map((loan) => <LoanCard key={loan.id} loan={loan} />)
        ) : (
          <p>No loans to display.</p>
        )}
      </section>
    </main>
  );
}
