"use client";

import { useBanking } from "@/hooks/useBanking";

export default function TransactionHistory() {
  const { user } = useBanking();
  
  if (!user || !user.transactions || user.transactions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <p className="text-gray-400">No transactions yet.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="pb-2">Date</th>
              <th className="pb-2">Description</th>
              <th className="pb-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {user.transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-700">
                <td className="py-3">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="py-3">{transaction.description}</td>
                <td className={`py-3 text-right ${
                  transaction.type === 'deposit' 
                    ? 'text-green-400' 
                    : transaction.type === 'withdrawal' 
                      ? 'text-red-400' 
                      : transaction.amount > 0 
                        ? 'text-green-400' 
                        : 'text-red-400'
                }`}>
                  {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}