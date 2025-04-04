import { useState, useEffect, createContext, useContext } from 'react';

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

interface BankingContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  deposit: (amount: number) => Promise<boolean>;
  withdraw: (amount: number) => Promise<boolean>;
  transfer: (recipientAccountNumber: string, amount: number, description: string) => Promise<boolean>;
}

// Create context
const BankingContext = createContext<BankingContextType | undefined>(undefined);

// Provider component
export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  // Deposit function
  const deposit = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
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
        amount,
        date: new Date().toISOString()
      };
      
      // Update user
      const updatedUser = {
        ...users[userIndex],
        balance: users[userIndex].balance + amount,
        transactions: [transaction, ...users[userIndex].transactions]
      };
      
      // Update users array
      users[userIndex] = updatedUser;
      
      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Withdraw function
  const withdraw = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      
      if (amount > user.balance) {
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
        amount,
        date: new Date().toISOString()
      };
      
      // Update user
      const updatedUser = {
        ...users[userIndex],
        balance: users[userIndex].balance - amount,
        transactions: [transaction, ...users[userIndex].transactions]
      };
      
      // Update users array
      users[userIndex] = updatedUser;
      
      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Transfer function
  const transfer = async (recipientAccountNumber: string, amount: number, description: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      
      if (amount > user.balance) {
        throw new Error("Insufficient funds");
      }
      
      // Get all users
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const senderIndex = users.findIndex((u: any) => u.id === user.id);
      const recipientIndex = users.findIndex((u: any) => u.accountNumber === recipientAccountNumber);
      
      if (senderIndex === -1) {
        throw new Error("Sender not found");
      }
      
      if (recipientIndex === -1) {
        throw new Error("Recipient not found");
      }
      
      if (senderIndex === recipientIndex) {
        throw new Error("Cannot transfer to yourself");
      }
      
      // Create sender transaction
      const senderTransaction: Transaction = {
        id: Date.now().toString(),
        description: `Transfer to ${users[recipientIndex].fullName} - ${description}`,
        type: "transfer",
        amount: -amount,
        date: new Date().toISOString()
      };
      
      // Create recipient transaction
      const recipientTransaction: Transaction = {
        id: (Date.now() + 1).toString(),
        description: `Transfer from ${user.fullName} - ${description}`,
        type: "transfer",
        amount,
        date: new Date().toISOString()
      };
      
      // Update sender
      const updatedSender = {
        ...users[senderIndex],
        balance: users[senderIndex].balance - amount,
        transactions: [senderTransaction, ...users[senderIndex].transactions]
      };
      
      // Update recipient
      const updatedRecipient = {
        ...users[recipientIndex],
        balance: users[recipientIndex].balance + amount,
        transactions: [recipientTransaction, ...users[recipientIndex].transactions]
      };
      
      // Update users array
      users[senderIndex] = updatedSender;
      users[recipientIndex] = updatedRecipient;
      
      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(updatedSender));
      
      // Update state
      setUser(updatedSender);
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <BankingContext.Provider value={{ 
      user, 
      loading, 
      error,
      deposit,
      withdraw,
      transfer
    }}>
      {children}
    </BankingContext.Provider>
  );
};

// Custom hook
export const useBanking = () => {
  const context = useContext(BankingContext);
  
  if (context === undefined) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  
  return context;
};