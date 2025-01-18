import React from 'react';

const Dashboard: React.FC = () => {
  // Placeholder user data
  const balance = 1500.75;
  const transactions = [
    { id: 1, type: 'Deposit', amount: 500, date: '2023-01-01' },
    { id: 2, type: 'Withdrawal', amount: 200, date: '2023-01-02' },
    { id: 3, type: 'Transfer', amount: 300, date: '2023-01-03' },
  ];

  return (
    <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText p-6">
      {/* Balance Section */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back!</p>
        <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">Current Balance</h2>
          <p className="text-4xl font-bold text-blue-600">${balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          Deposit
        </button>
        <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
          Withdraw
        </button>
        <button className="w-full bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700">
          Transfer
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2">Date</th>
              <th className="border-b py-2">Type</th>
              <th className="border-b py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td className="border-b py-2 text-gray-600 dark:text-gray-400">{txn.date}</td>
                <td className="border-b py-2">{txn.type}</td>
                <td className="border-b py-2 text-blue-600">${txn.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;