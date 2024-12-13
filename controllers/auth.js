const express = require('express');
const db = require('../database/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await db.oneOrNone('SELECT * FROM users WHERE email_id = $1', email); // ('users').where({ email }).first();
    
        if (user == null) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const { password: _, ...userWithoutPassword } = user;

        const auth_cookie = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '12d' });

        res.cookie('auth_cookie', auth_cookie, { httpOnly: true, secure: true, maxAge: 12 * 24 * 60 * 60 * 1000 }); // 12 days
        res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

async function authorize(req, res, next) {
    const auth_cookie = req.cookies.auth_cookie;

    try {
        const decoded = jwt.verify(auth_cookie, process.env.JWT_SECRET);
        req.user_id = decoded;
        next();
    } catch (error) {
        return res.redirect('/auth/login');
    }
}

module.exports = {
    authorize,
    authRouter
};