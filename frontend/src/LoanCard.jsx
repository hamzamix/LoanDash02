export default function LoanCard({ loan }) {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-md p-4">
      <h2 className="text-xl font-semibold">{loan.borrower}</h2>
      <p className="text-slate-600 dark:text-slate-400">${loan.amount.toLocaleString()}</p>
    </div>
  );
}
