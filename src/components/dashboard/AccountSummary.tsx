"use client";

import { useBanking } from "@/hooks/useBanking";

export default function AccountSummary() {
  const { user } = useBanking();
  
  if (!user) return null;
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded-md">
          <p className="text-gray-400 text-sm">Account Number</p>
          <p className="text-lg font-medium">{user.accountNumber}</p>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-md">
          <p className="text-gray-400 text-sm">Current Balance</p>
          <p className="text-lg font-medium">${user.balance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}