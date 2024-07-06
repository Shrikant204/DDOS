const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');
let fetch;
import('node-fetch').then(module => {
    fetch = module.default;
});
const app = express();
const port = 10000;

let blacklist = [];
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: '*'}))

// Middleware to log IP addresses
app.use((req, res, next) => {
    const ip = req.hostname;
    console.log(`Request received from IP: ${ip}`);
    next();
});

// Rate limiting middleware to prevent DDoS attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    handler: (req, res) => {
        const ip = req.hostname;
        console.log(`IP ${ip} is blocked due to too many requests`);
        blacklist.push(ip); // Add IP to blacklist
        res.status(429).send('Too many requests - you are being rate limited');
    }
});

app.use(limiter);

// IP Blacklist middleware
app.use((req, res, next) => {
    const ip = req.ip;
    if (blacklist.includes(ip)) {
        return res.status(403).send('Access denied');
    }
    next();
});

// Endpoint to fetch user info from GitHub API
app.get('/users/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            throw new Error(`Error fetching user info: ${response.status}`);
        }
        const userInfo = await response.json();
        
        console.log(userInfo);
        res.status(200).json(userInfo);
        
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error fetching user info: ${error.message}`);
    }
});

// Endpoint to fetch user repositories from GitHub API
app.get('/users/:username/repos', async (req, res) => {
    const username = req.params.username;
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!response.ok) {
            throw new Error(`Error fetching user repositories: ${response.status}`);
        }
        const repositories = await response.json();
        res.json(repositories);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error fetching user repositories: ${error.message}`);
    }
});

// Endpoint to clear the blacklist (for testing purposes)
app.get('/clear-blacklist', (req, res) => {
    blacklist = [];
    res.send('Blacklist cleared');
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
