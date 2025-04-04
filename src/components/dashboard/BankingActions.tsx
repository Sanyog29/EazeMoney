"use client";

import { useState } from "react";
import { useBanking } from "@/hooks/useBanking";

export default function BankingActions() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw" | "transfer">("deposit");
  const [amount, setAmount] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [description, setDescription] = useState("");
  const { deposit, withdraw, transfer, loading, error } = useBanking();
  const [success, setSuccess] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    
    const amountValue = parseFloat(amount);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      return;
    }
    
    try {
      let result = false;
      
      if (activeTab === "deposit") {
        result = await deposit(amountValue);
        if (result) setSuccess("Deposit successful!");
      } else if (activeTab === "withdraw") {
        result = await withdraw(amountValue);
        if (result) setSuccess("Withdrawal successful!");
      } else if (activeTab === "transfer") {
        if (!recipientAccount) return;
        result = await transfer(recipientAccount, amountValue, description || "Transfer");
        if (result) setSuccess("Transfer successful!");
      }
      
      if (result) {
        setAmount("");
        setRecipientAccount("");
        setDescription("");
      }
    } catch (err) {
      console.error("Transaction error:", err);
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Banking Actions</h2>
      
      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`py-2 px-4 ${
            activeTab === "deposit" 
              ? "border-b-2 border-blue-500 text-blue-400" 
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("deposit")}
        >
          Deposit
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "withdraw" 
              ? "border-b-2 border-blue-500 text-blue-400" 
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("withdraw")}
        >
          Withdraw
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "transfer" 
              ? "border-b-2 border-blue-500 text-blue-400" 
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("transfer")}
        >
          Transfer
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-md text-green-200">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>
        </div>
        
        {activeTab === "transfer" && (
          <>
            <div className="mb-4">
              <label htmlFor="recipientAccount" className="block text-sm font-medium text-gray-300 mb-1">
                Recipient Account Number
              </label>
              <input
                type="text"
                id="recipientAccount"
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="Enter account number"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                placeholder="Enter description"
              />
            </div>
          </>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading
            ? "Processing..."
            : activeTab === "deposit"
            ? "Deposit Funds"
            : activeTab === "withdraw"
            ? "Withdraw Funds"
            : "Send Transfer"}
        </button>
      </form>
    </div>
  );
}