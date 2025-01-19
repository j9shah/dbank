import React, { useState, useEffect } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import axiosInstance from '../utils/axiosInstance';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [showModal, setShowModal] = useState<null | 'deposit' | 'withdraw' | 'transfer'>(null);
  const [amount, setAmount] = useState<number | string>('');
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<
    { id: number; date: string; type: string; amount: number; details: string }[]
  >([]);
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          alert('You are not authenticated. Please log in.');
          window.location.href = '/';
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const [balanceResponse, transactionsResponse, userResponse] = await Promise.all([
          axiosInstance.get('/api/users/balance', { headers }),
          axiosInstance.post('/api/transactions/getTransactions', {}, { headers }),
          axiosInstance.get('/api/users/me', { headers }),
        ]);

        setBalance(Number(balanceResponse.data.balance) || 0);

        const normalizedTransactions = transactionsResponse.data.transactions.map((transaction: any) => ({
          id: transaction.id,
          date: transaction.createdAt
            ? format(new Date(transaction.createdAt), "yyyy-MM-dd hh:mm:ss a 'EST'")
            : 'Invalid Date',
          type: transaction.type,
          amount: Number(transaction.amount),
          details: transaction.senderRecipient || transaction.details || '-',
        }));

        setTransactions(normalizedTransactions);
        setUserEmail(userResponse.data.email);
      } catch (error: any) {
        console.error('Error in fetchData:', error);
        alert('Failed to load data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (Number(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (showModal === 'transfer' && !recipientEmail) {
      alert('Please enter a valid recipient email.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You are not authenticated. Please log in.');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const endpoint = `/api/transactions/${showModal}`;
      const payload =
        showModal === 'transfer'
          ? { amount: Number(amount), recipientEmail }
          : { amount: Number(amount) };

      await axiosInstance.post(endpoint, payload, { headers });

      const [balanceResponse, transactionsResponse] = await Promise.all([
        axiosInstance.get('/api/users/balance', { headers }),
        axiosInstance.post('/api/transactions/getTransactions', {}, { headers }),
      ]);

      setBalance(Number(balanceResponse.data.balance) || 0);

      const normalizedTransactions = transactionsResponse.data.transactions.map((transaction: any) => ({
        id: transaction.id,
        date: transaction.createdAt
          ? format(new Date(transaction.createdAt), "yyyy-MM-dd hh:mm:ss a 'EST'")
          : 'Invalid Date',
        type: transaction.type,
        amount: Number(transaction.amount),
        details: transaction.senderRecipient || transaction.details || '-',
      }));

      setTransactions(normalizedTransactions);

      alert(`${showModal} successful!`);
      setShowModal(null);
      setAmount('');
      setRecipientEmail('');
    } catch (error: any) {
      console.error('Error during transaction:', error);
      alert(`Error during ${showModal}: ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  return (
    <div className="min-h-screen bg-lightBackground dark:bg-darkBackground text-darkText dark:text-lightText">
      <div className="flex justify-between items-center px-4 py-4">
        <h1 className="text-2xl font-bold dark:text-white text-gray-800">Dashboard</h1>
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="text-center mb-8">
          <p className="text-lg font-semibold dark:text-gray-300 text-gray-700">Current Balance</p>
          <p className="text-4xl font-bold text-blue-500">${balance.toFixed(2)}</p>
          <p className="text-sm dark:text-gray-400 text-gray-600">Logged in as: {userEmail}</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setShowModal('deposit')}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg transition duration-300"
          >
            Deposit
          </button>
          <button
            onClick={() => setShowModal('withdraw')}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg transition duration-300"
          >
            Withdraw
          </button>
          <button
            onClick={() => setShowModal('transfer')}
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-lg transition duration-300"
          >
            Transfer
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 dark:text-gray-200 text-gray-800">Recent Transactions</h3>
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Details</th>
                <th className="py-2 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-t text-gray-800 dark:text-gray-300 dark:border-gray-700"
                >
                  <td className="py-2 px-4">{transaction.date}</td>
                  <td className="py-2 px-4">{transaction.type}</td>
                  <td className="py-2 px-4">{transaction.details}</td>
                  <td
                    className={`py-2 px-4 ${
                      transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 dark:text-gray-200 text-gray-800 capitalize">
              {showModal} Amount
            </h3>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-lightBackground dark:bg-darkBackground text-black dark:text-white"
            />
            {showModal === 'transfer' && (
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Recipient Email"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 bg-lightBackground dark:bg-darkBackground text-black dark:text-white"
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;