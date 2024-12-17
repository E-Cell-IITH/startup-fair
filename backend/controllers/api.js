const express = require('express');
const router = express.Router();
const db = require('../database/config');
const { authorize } = require('../controllers/auth');

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());

// GET all startups
router.get('/startup/', async (req, res) => {
  try {
    const startups = await db.any('SELECT * FROM startup');
    res.status(200).json(startups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET startup by id
router.get('/startup/:id', async (req, res) => {
  try {
    const startup = await db.oneOrNone('SELECT * FROM startup WHERE id = $1', [req.params.id]);
    
    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }
    
    res.status(200).json(startup);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.use(authorize);

// GET user by auth token
router.get('/user/me', async (req, res) => {
  if (!req.user_id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const user = await db.oneOrNone('SELECT id, name, email_id, amount FROM users WHERE id = $1', [req.user_id]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET user by id
router.get('/user/:id', async (req, res) => {
  if (!req.user_id || req.user_id !== req.params.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const user = await db.oneOrNone('SELECT id, name, email_id, amount FROM users WHERE id = $1', [req.params.id]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.use((req, res, next) => {
  if (!req.user_id) return res.status(403).json({ error: 'Unauthorized' });
  next();
})

router.post('/pay', async (req, res) => {
    const startup = req.body.startup_id;
    const amount = req.body.amount;

    const PAYMENT_QUERY = `WITH update_balance AS (
      UPDATE users 
      SET amount = amount - $1
      WHERE id = $2 AND amount >= $1
      RETURNING amount AS new_user_balance
    )
    UPDATE startup 
    SET amount = amount + $1
    FROM update_balance
    WHERE startup.id = $3
    RETURNING new_user_balance AS new_user_balance;`

    const payment_result = await db.oneOrNone(PAYMENT_QUERY, [amount, req.user_id, startup]);

    if (!payment_result) {
        return res.status(400).json({ error: 'Payment failed, insufficient funds or invalid startup ID' });
    }

    res.status(200).json({ message: 'Payment successful', new_balance: payment_result.new_user_balance });
});


module.exports = router;