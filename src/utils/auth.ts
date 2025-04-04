// This file simulates backend authentication and data operations
// In a real app, these would be API calls to a backend server

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "deposit" | "withdrawal" | "transfer";
}

export interface LoginRecord {
  id: string;
  userId: string;
  timestamp: string;
  ipAddress: string;
  deviceInfo: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string; // In a real app, NEVER store plain text passwords
  accountNumber: string;
  balance: number;
  transactions: Transaction[];
  loginRecords?: LoginRecord[];
}

// Get device info
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const browserInfo = userAgent.match(/(chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  return `${browserInfo[1] || 'Unknown'} ${browserInfo[2] || ''} - ${navigator.platform}`;
};

// Record a login
export const recordLogin = (userId: string) => {
  try {
    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Create login record
    const loginRecord: LoginRecord = {
      id: Date.now().toString(),
      userId,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1', // In a real app, this would come from the server
      deviceInfo: getDeviceInfo()
    };
    
    // Initialize loginRecords array if it doesn't exist
    if (!users[userIndex].loginRecords) {
      users[userIndex].loginRecords = [];
    }
    
    // Add login record
    users[userIndex].loginRecords.push(loginRecord);
    
    // Save updated users
    localStorage.setItem('users', JSON.stringify(users));
    
    // Also store login records separately for analytics
    const allLoginRecords = JSON.parse(localStorage.getItem('loginRecords') || '[]');
    allLoginRecords.push(loginRecord);
    localStorage.setItem('loginRecords', JSON.stringify(allLoginRecords));
    
    return { success: true };
  } catch (error: any) {
    console.error('Error recording login:', error);
    return { success: false, error: error.message };
  }
};

// Register a new user
export const registerUser = (userData: Omit<User, 'id' | 'accountNumber' | 'balance' | 'transactions'>) => {
  try {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some((user: User) => user.email === userData.email)) {
      throw new Error('Email already registered');
    }
    
    // Create new user with default values
    const newUser: User = {
      id: Date.now().toString(),
      accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      balance: 1000, // Starting balance
      transactions: [],
      loginRecords: [],
      ...userData
    };
    
    // Add to users array and save
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, userId: newUser.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Login user
export const loginUser = (email: string, password: string) => {
  try {
    // Get users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching email and password
    const user = users.find((u: User) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Record this login
    recordLogin(user.id);
    
    // Store current user in localStorage (in a real app, use JWT or secure cookies)
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = () => {
  try {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      return { success: false, error: 'Not logged in' };
    }
    
    return { success: true, user: JSON.parse(userJson) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
  return { success: true };
};

// Get login history for a user
export const getLoginHistory = (userId: string) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return { 
      success: true, 
      loginRecords: user.loginRecords || [] 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Transfer money
export const transferMoney = (
  senderId: string, 
  recipientAccountNumber: string, 
  amount: number, 
  description: string = ''
) => {
  try {
    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Please enter a valid amount');
    }
    
    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find sender and recipient
    const senderIndex = users.findIndex((u: User) => u.id === senderId);
    const recipientIndex = users.findIndex((u: User) => u.accountNumber === recipientAccountNumber);
    
    if (senderIndex === -1) {
      throw new Error('Sender not found');
    }
    
    if (recipientIndex === -1) {
      throw new Error('Recipient account not found');
    }
    
    // Check if sender has enough balance
    if (users[senderIndex].balance < amount) {
      throw new Error('Insufficient funds');
    }
    
    // Create transaction objects
    const transactionId = Date.now().toString();
    const transactionDate = new Date().toISOString();
    
    const senderTransaction: Transaction = {
      id: transactionId + '-s',
      date: transactionDate,
      description: description || `Transfer to ${users[recipientIndex].fullName}`,
      amount,
      type: 'transfer'
    };
    
    const recipientTransaction: Transaction = {
      id: transactionId + '-r',
      date: transactionDate,
      description: description || `Transfer from ${users[senderIndex].fullName}`,
      amount,
      type: 'deposit'
    };
    
    // Update balances and add transactions
    users[senderIndex].balance -= amount;
    users[senderIndex].transactions.unshift(senderTransaction);
    
    users[recipientIndex].balance += amount;
    users[recipientIndex].transactions.unshift(recipientTransaction);
    
    // Save updated users
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user
    localStorage.setItem('currentUser', JSON.stringify(users[senderIndex]));
    
    return { success: true, user: users[senderIndex] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};