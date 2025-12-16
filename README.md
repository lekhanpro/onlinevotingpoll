# 🗳️ Online Voting System

A secure, simple online voting system that simulates an Electronic Voting Machine (EVM). Built with Node.js, Express, and vanilla JavaScript.

![Voting System](https://img.shields.io/badge/Status-Live-green) ![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

## ✨ Features

- **User Login** - Voters authenticate using unique Voter IDs
- **One-Vote Constraint** - System prevents duplicate voting
- **EVM-Style Ballot** - Clean layout with candidates and vote buttons
- **Confirmation Modal** - Voters confirm before casting vote
- **Vote Recording** - Votes saved to database
- **Live Results** - Real-time vote count dashboard
- **Responsive Design** - Works on desktop and mobile

## 🚀 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/online-voting-poll)

### Manual Deploy

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd "online voting poll"
   vercel
   ```

4. **Follow the prompts** and your app will be live!

## 💻 Run Locally

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project
cd "online voting poll"

# Install dependencies
npm install

# Start the server
npm start

# Open browser
# Navigate to http://localhost:3000
```

## 🧪 Test Voter IDs

Use any of these sample voter IDs to test:

| Voter ID | Name | Status |
|----------|------|--------|
| VOTER001 | Rahul Kumar | Already Voted |
| VOTER002 | Priya Sharma | Already Voted |
| VOTER003 | Amit Singh | Available ✅ |
| VOTER004 | Sneha Patel | Available ✅ |
| VOTER005 | Vijay Reddy | Available ✅ |
| VOTER006 | Anita Desai | Available ✅ |
| VOTER007 | Rajesh Gupta | Available ✅ |
| VOTER008 | Meera Iyer | Available ✅ |
| VOTER009 | Suresh Nair | Already Voted |
| VOTER010 | Kavita Joshi | Available ✅ |

## 📁 Project Structure

```
online voting poll/
├── api/                    # Vercel Serverless Functions
│   ├── _data.js           # Shared data store
│   ├── login.js           # POST /api/login
│   ├── candidates.js      # GET /api/candidates
│   ├── vote.js            # POST /api/vote
│   ├── results.js         # GET /api/results
│   └── check-voted.js     # GET /api/check-voted
├── public/                 # Static files
│   ├── index.html         # Login page
│   ├── ballot.html        # Voting interface
│   ├── thankyou.html      # Success page
│   ├── results.html       # Results dashboard
│   ├── style.css          # All styling
│   └── app.js             # Client-side logic
├── data/                   # Local JSON database (for dev)
│   ├── voters.json
│   └── candidates.json
├── server.js              # Express server (local dev)
├── vercel.json            # Vercel configuration
├── package.json
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/login` | Authenticate voter |
| `GET` | `/api/candidates` | Get candidates list |
| `POST` | `/api/vote` | Cast a vote |
| `GET` | `/api/results` | Get live results |
| `GET` | `/api/check-voted?voterId=X` | Check vote status |

## ⚠️ Important Notes

> **Note:** This demo uses in-memory storage for Vercel deployment. In production, you should:
> - Use a real database (MongoDB, Supabase, Vercel KV, etc.)
> - Implement proper authentication
> - Add rate limiting
> - Use HTTPS

## 🎨 Design

- **Color Scheme**: Official blue (#1a237e) and white
- **Style**: EVM (Electronic Voting Machine) inspired
- **Party Symbols**: 🍎 🔦 🚲 ✋

## 📄 License

MIT License - Feel free to use and modify!

---

Made with ❤️ for Democracy
