"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const google_auth_library_1 = require("google-auth-library");
const router = (0, express_1.Router)();
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
// Generate Google OAuth URL
router.get('/google-url', async (req, res) => {
    try {
        const scopes = ['email', 'profile'];
        const authUrl = googleClient.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent'
        });
        res.json({ authUrl });
    }
    catch (error) {
        console.error('Google OAuth URL generation error:', error);
        res.status(500).json({ error: 'Failed to generate Google OAuth URL' });
    }
});
// Handle Google OAuth callback
router.post('/google-callback', async (req, res) => {
    try {
        const { code } = req.body;
        const { tokens } = await googleClient.getToken(code);
        googleClient.setCredentials(tokens);
        // Get user info from Google
        const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`);
        const userInfo = await userInfoResponse.json();
        // Create/find user in your database
        const user = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            role: 'student' // Default role
        };
        // Generate JWT token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({ token, user });
    }
    catch (error) {
        console.error('Google OAuth callback error:', error);
        res.status(500).json({ error: 'Failed to process Google OAuth callback' });
    }
});
exports.default = router;
