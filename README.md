
# 💸 EazeMoney - Modern Banking Web App

EazeMoney is a secure, full-stack banking web application built for seamless financial transactions. With a clean UI and powerful backend, it allows users to deposit, withdraw, transfer funds, and view spending insights in real-time.

---

## 🚀 Features

- 🔐 **User Authentication** (Sign Up / Log In)
- 💰 **Deposit & Withdraw Money**
- 💳 **Transfer Money to Other Users**
- 🧾 **Check Account Balance**
- 📊 **Monthly Expense Tracking with Charts**
- 🧠 **Intelligent Spending Insights (Coming Soon)**

---

## 🧱 Tech Stack

### Frontend:
- **Next.js** – React Framework
- **Tailwind CSS** – Utility-first CSS framework
- **Chart.js** – For visualizing transactions and spending trends

### Backend:
- **Node.js** & **Express.js** – API development
- **MongoDB** – NoSQL database to store user data and transactions
- **JWT** – JSON Web Tokens for secure user sessions

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/eazemoney.git
cd eazemoney
```

### 2. Backend Setup
```bash
cd backend
npm install
# Add your environment variables in .env
npm start
```

#### `.env` example:
```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### `.env.local` example:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📡 API Endpoints

| Method | Endpoint                  | Description             |
|--------|---------------------------|-------------------------|
| POST   | `/api/auth/register`      | Register new users      |
| POST   | `/api/auth/login`         | Authenticate user       |
| GET    | `/api/user/balance`       | Get user balance        |
| POST   | `/api/transaction/deposit`| Deposit money           |
| POST   | `/api/transaction/withdraw` | Withdraw money        |
| POST   | `/api/transaction/transfer` | Transfer money to another user |

---

## 🔗 https://www.linkedin.com/posts/sanyog-tripathi29_nextjs-nodejs-mongodb-activity-7309681956017815553-tr5B?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEbUSP8BoDL5KLGNCQVnLjVE23OX8xhO0g8
---

## 🤝 Contributing

Contributions are welcome!  
- Fork the repository
- Create a new branch (`git checkout -b feature/your-feature`)
- Commit your changes
- Open a Pull Request

---

## 🪪 License

This project is licensed under the **MIT License**.

---

## 🙋‍♂️ Author

**Sanyog 😊**  
GitHub: [Sanyog Tripathi](https://github.com/sanyog29).   

