const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({ email });
        if (findUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {

        res.status(500).json({ message: 'Server error' });
    }
}
const googleLogin = async (req, res) => {
    try {
        const { access_token } = req.body;
        //Fetch the user information from Google using the access token
        const response = await fetch(process.env.GOOGLE_USER_INFO_URL, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        if (!response.ok) {
            return res.status(400).json({ message: 'Invalid access token' });
        }
        const googleuser = await response.json();
        const { id: googleId, email } = googleuser;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ email, googleId });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token });

    } catch (e) {

        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { registerUser, loginUser, googleLogin };