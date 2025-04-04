"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MiniDashboard from "@/components/dashboard/MiniDashboard";

// Define types
interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'deposit' | 'transfer' | 'withdrawal';
  date: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  accountNumber: string;
  balance: number;
  transactions: Transaction[];
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "deposit" | "withdraw" | "transfer">("overview");
  const [amount, setAmount] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transactionLoading, setTransactionLoading] = useState(false);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
          router.push("/login");
          return;
        }
        
        setUser(JSON.parse(currentUser));
      } catch (err) {
        console.error("Error checking auth:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  const handleDeposit = async () => {
    if (!user) return;
    
    setError("");
    setSuccess("");
    setTransactionLoading(true);
    
    try {
      const amountValue = parseFloat(amount);
      
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      // Get all users
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Create transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        description: "Deposit",
        type: "deposit",
        amount: amountValue,
        date: new Date().toISOString()
      };
      
      // Update user
      const updatedUser = {
        ...users[userIndex],
        balance: users[userIndex].balance + amountValue,
        transactions: [transaction, ...(users[userIndex].transactions || [])]
      };
      
      // Update users array
      users[userIndex] = updatedUser;
      
      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      setSuccess("Deposit successful!");
      setAmount("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user) return;
    
    setError("");
    setSuccess("");
    setTransactionLoading(true);
    
    try {
      const amountValue = parseFloat(amount);
      
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      if (amountValue > user.balance) {
        throw new Error("Insufficient funds");
      }
      
      // Get all users
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error("User not found");
      }
      
      // Create transaction
      const transaction: Transaction = {
        id: Date.now().toString(),
        description: "Withdrawal",
        type: "withdrawal",
        amount: amountValue,
        date: new Date().toISOString()
      };
      
      // Update user
      const updatedUser = {
        ...users[userIndex],
        balance: users[userIndex].balance - amountValue,
        transactions: [transaction, ...(users[userIndex].transactions || [])]
      };
      
      // Update users array
      users[userIndex] = updatedUser;
      
      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      setSuccess("Withdrawal successful!");
      setAmount("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!user) return;
    
    setError("");
    setSuccess("");
    setTransactionLoading(true);
    
    try {
      const amountValue = parseFloat(amount);
      
      if (isNaN(amountValue) || amountValue <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      if (amountValue > user.balance) {
        throw new Error("Insufficient funds");
      }
      
      if (!recipientAccount) {
        throw new Error("Please enter recipient account number");
      }
      
      // Get all users
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const senderIndex = users.findIndex((u: any) => u.id === user.id);
      const recipientIndex = users.findIndex((u: any) => u.accountNumber === recipientAccount);
      
      if (senderIndex === -1) {
        throw new Error("Sender not found");
      }
      
      if (recipientIndex === -1) {
        throw new Error("Recipient account not found");
      }
      
      if (senderIndex === recipientIndex) {
        throw new Error("Cannot transfer to your own account");
      }
      
      // Create sender transaction
      const senderTransaction: Transaction = {
        id: Date.now().toString(),
        description: `Transfer to ${users[recipientIndex].fullName}${description ? ` - ${description}` : ''}`,
        type: "transfer",
        amount: -amountValue,
        date: new Date().toISOString()
      };
      
      // Create recipient transaction
      const recipientTransaction: Transaction = {
        id: (Date.now() + 1).toString(),
        description: `Transfer from ${user.fullName}${description ? ` - ${description}` : ''}`,
        type: "transfer",
        amount: amountValue,
        date: new Date().toISOString()
      };
      
      // Update sender
      const updatedSender = {
        ...users[senderIndex],
        balance: users[senderIndex].balance - amountValue,
        transactions: [senderTransaction, ...(users[senderIndex].transactions || [])]
      };
      
      // Update recipient
      const updatedRecipient = {
        ...users[recipientIndex],
        balance: users[recipientIndex].balance + amountValue,
        transactions: [recipientTransaction, ...(users[recipientIndex].transactions || [])]
      };
      
      // Update users array
      users[senderIndex] = updatedSender;
      users[recipientIndex] = updatedRecipient;
      
      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(updatedSender));
      
      // Update state
      setUser(updatedSender);
      setSuccess("Transfer successful!");
      setAmount("");
      setRecipientAccount("");
      setDescription("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTransactionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold text-blue-400">
            EazeMoney
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Hello, {user.fullName}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-300 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Mini Dashboard - NEW COMPONENT */}
            <MiniDashboard />
            
            {/* Account Summary */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-4 rounded-md">
                  <p className="text-gray-400 text-sm">Account Number</p>
                  <p className="text-lg font-medium">{user.accountNumber}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-md">
                  <p className="text-gray-400 text-sm">Current Balance</p>
                  <p className="text-lg font-medium">₹{user.balance.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            {/* Transaction History */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
              
              {user.transactions && user.transactions.length > 0 ? (
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
                            transaction.type === 'deposit' || (transaction.type === 'transfer' && transaction.amount > 0)
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {transaction.type === 'deposit' || (transaction.type === 'transfer' && transaction.amount > 0)
                              ? '+' 
                              : '-'}
                            ₹{Math.abs(transaction.amount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400">No transactions yet.</p>
              )}
            </div>
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Banking Actions</h2>
              
              <div className="flex border-b border-gray-700 mb-4">
                <button
                  className={`py-2 px-4 ${
                    activeTab === "overview" 
                      ? "border-b-2 border-blue-500 text-blue-400" 
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
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
              
              {activeTab === "overview" && (
                <div>
                  <p className="text-gray-300 mb-4">
                    Welcome to your EazeMoney dashboard. Here you can manage your account, make deposits, withdrawals, and transfers.
                  </p>
                  <div className="bg-gray-700 p-4 rounded-md mb-4">
                    <p className="text-gray-400 text-sm">Account Holder</p>
                    <p className="text-lg font-medium">{user.fullName}</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-md mb-4">
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-lg font-medium">{user.email}</p>
                  </div>
                </div>
              )}
              
              {activeTab === "deposit" && (
                <form onSubmit={(e) => { e.preventDefault(); handleDeposit(); }}>
                  <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                      Amount to Deposit
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
                  
                  <button
                    type="submit"
                    disabled={transactionLoading}
                    className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition ${
                      transactionLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {transactionLoading ? "Processing..." : "Deposit Funds"}
                  </button>
                </form>
              )}
              
              {activeTab === "withdraw" && (
                <form onSubmit={(e) => { e.preventDefault(); handleWithdraw(); }}>
                  <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                      Amount to Withdraw
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
                        max={user.balance}
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={transactionLoading}
                    className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition ${
                      transactionLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {transactionLoading ? "Processing..." : "Withdraw Funds"}
                  </button>
                </form>
              )}
              
              {activeTab === "transfer" && (
                <form onSubmit={(e) => { e.preventDefault(); handleTransfer(); }}>
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
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                      Amount to Transfer
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
                        max={user.balance}
                        required
                      />
                    </div>
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
                  
                  <button
                    type="submit"
                    disabled={transactionLoading}
                    className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition ${
                      transactionLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {transactionLoading ? "Processing..." : "Send Transfer"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} EazeMoney. Created and Hosted By Sanyog Tripathi</p>
          <p className="mt-2 text-sm">This is a demo application. Real Web Banking Simulation.</p>
        </div>
      </footer>
    </div>
  );  // This closing curly brace was missing
}