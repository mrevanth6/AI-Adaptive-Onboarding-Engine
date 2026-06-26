const express = require('express');
const OTP = require('../models/OTP');
const User = require('../models/User');
const { sendEmail } = require('../services/emailService');
const bcrypt = require('bcrypt');
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
async function sendOTP(req, res) {
    const { email, type } = req.body;
    const otp = generateOTP();
    try {
        const isUserExists = await User.findOne({ email });
        if ((type === 'signup' && isUserExists)) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (type === 'reset-password' && !isUserExists) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        // Handle the case where an OTP already exists for the email and type and delete it before creating a new one also handles Resend OTP scenario
        const existingOTP = await OTP.findOne({ email, type });
        if (existingOTP) {
            await OTP.deleteOne({ email, type });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);
        await OTP.create({ email, otp: hashedOTP, type });
        await sendEmail(email, 'Your OTP Code', `Your OTP code is: ${otp}.`);
        res.status(200).json({ message: 'OTP sent successfully' });

    } catch (error) {
        return res.status(500).json({ message: error.message || 'Error occurred while sending OTP' });
    }
}
async function verifyOTP(req, res) {
    const { email, otp, type } = req.body;
    try {
        const otpRecord = await OTP.findOne({ email, type });
        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP not found' });
        }
        const isOTPValid = await bcrypt.compare(otp, otpRecord.otp);
        if (!isOTPValid) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        await OTP.deleteOne({ email, type });
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error occurred while verifying OTP' });
    }
}
module.exports = { sendOTP, verifyOTP };