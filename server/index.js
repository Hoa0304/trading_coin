import express from 'express';
import cors from 'cors';
import sqlite3 from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = sqlite3(dbPath);

// Initialize database
function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Portfolios table
  db.exec(`
    CREATE TABLE IF NOT EXISTS portfolios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      btc_balance REAL DEFAULT 0 CHECK(btc_balance >= 0),
      usd_balance REAL DEFAULT 10000.00 CHECK(usd_balance >= 0),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id)
    )
  `);

  // Transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('buy', 'sell')),
      btc_amount REAL NOT NULL CHECK(btc_amount > 0),
      usd_amount REAL NOT NULL CHECK(usd_amount > 0),
      btc_price REAL NOT NULL CHECK(btc_price > 0),
      status TEXT DEFAULT 'completed' CHECK(status IN ('pending', 'completed', 'failed')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized');
}

// Middleware để verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Initialize database on startup
initDatabase();

// ==================== AUTHENTICATION ROUTES ====================

// Đăng ký
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    const result = db.prepare(`
      INSERT INTO users (email, password, full_name)
      VALUES (?, ?, ?)
    `).run(email, hashedPassword, full_name || email.split('@')[0]);

    const userId = result.lastInsertRowid;

    // Tạo portfolio với $10,000 ban đầu
    db.prepare(`
      INSERT INTO portfolios (user_id, btc_balance, usd_balance)
      VALUES (?, 0, 10000)
    `).run(userId);

    // Tạo JWT token
    const token = jwt.sign(
      { id: userId, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: userId,
        email,
        full_name: full_name || email.split('@')[0],
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Đăng nhập
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Tìm user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Lấy thông tin user hiện tại
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, full_name FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// ==================== PORTFOLIO ROUTES ====================

// Lấy portfolio
app.get('/api/portfolio', authenticateToken, (req, res) => {
  try {
    const portfolio = db.prepare('SELECT * FROM portfolios WHERE user_id = ?').get(req.user.id);
    if (!portfolio) {
      // Tạo portfolio mặc định nếu chưa có
      db.prepare(`
        INSERT INTO portfolios (user_id, btc_balance, usd_balance)
        VALUES (?, 0, 10000)
      `).run(req.user.id);
      const newPortfolio = db.prepare('SELECT * FROM portfolios WHERE user_id = ?').get(req.user.id);
      return res.json(newPortfolio);
    }
    res.json(portfolio);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Failed to get portfolio' });
  }
});

// Cập nhật portfolio
app.put('/api/portfolio', authenticateToken, (req, res) => {
  try {
    const { btc_balance, usd_balance } = req.body;

    if (btc_balance < 0 || usd_balance < 0) {
      return res.status(400).json({ error: 'Balance cannot be negative' });
    }

    db.prepare(`
      UPDATE portfolios
      SET btc_balance = ?, usd_balance = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).run(btc_balance, usd_balance, req.user.id);

    const portfolio = db.prepare('SELECT * FROM portfolios WHERE user_id = ?').get(req.user.id);
    res.json(portfolio);
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// ==================== COINGECKO API PROXY ====================
// Proxy endpoint để tránh CORS và rate limit issues

// Cache để tránh quá nhiều requests
let priceCache = {
  data: null,
  timestamp: 0,
  ttl: 10000, // 10 seconds cache
};

let historyCache = {
  data: null,
  timestamp: 0,
  ttl: 60000, // 60 seconds cache
};

// Lấy giá Bitcoin hiện tại
app.get('/api/bitcoin/price', async (req, res) => {
  try {
    // Kiểm tra cache
    const now = Date.now();
    if (priceCache.data && (now - priceCache.timestamp) < priceCache.ttl) {
      return res.json(priceCache.data);
    }

    // Gọi CoinGecko API
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Nếu rate limit, trả về cache cũ hoặc giá mặc định
      if (response.status === 429 && priceCache.data) {
        console.warn('CoinGecko rate limit, returning cached data');
        return res.json(priceCache.data);
      }
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Update cache
    priceCache.data = data;
    priceCache.timestamp = now;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    
    // Nếu có cache, trả về cache
    if (priceCache.data) {
      console.warn('Returning cached price due to error');
      return res.json(priceCache.data);
    }
    
    // Fallback giá mặc định
    res.json({
      bitcoin: {
        usd: 67234.50,
        usd_24h_change: 0,
      },
    });
  }
});

// Lấy lịch sử giá Bitcoin
app.get('/api/bitcoin/history', async (req, res) => {
  try {
    // Kiểm tra cache
    const now = Date.now();
    if (historyCache.data && (now - historyCache.timestamp) < historyCache.ttl) {
      return res.json(historyCache.data);
    }

    // Gọi CoinGecko API
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Nếu rate limit, trả về cache cũ
      if (response.status === 429 && historyCache.data) {
        console.warn('CoinGecko rate limit, returning cached history');
        return res.json(historyCache.data);
      }
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Update cache
    historyCache.data = data;
    historyCache.timestamp = now;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching Bitcoin history:', error);
    
    // Nếu có cache, trả về cache
    if (historyCache.data) {
      console.warn('Returning cached history due to error');
      return res.json(historyCache.data);
    }
    
    // Fallback empty data
    res.json({ prices: [] });
  }
});

// ==================== TRANSACTION ROUTES ====================

// Lấy transactions
app.get('/api/transactions', authenticateToken, (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const transactions = db.prepare(`
      SELECT * FROM transactions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(req.user.id);
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Tạo transaction
app.post('/api/transactions', authenticateToken, (req, res) => {
  try {
    const { type, btc_amount, usd_amount, btc_price } = req.body;

    if (!type || !btc_amount || !usd_amount || !btc_price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (type !== 'buy' && type !== 'sell') {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    // Insert transaction
    const result = db.prepare(`
      INSERT INTO transactions (user_id, type, btc_amount, usd_amount, btc_price, status)
      VALUES (?, ?, ?, ?, ?, 'completed')
    `).run(req.user.id, type, btc_amount, usd_amount, btc_price);

    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);
    res.json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

