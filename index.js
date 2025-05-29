// Calculator App

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;

const WINDOW_SIZE = 10;
const API_URL = 'http://20.244.56.144/evaluation-service';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ4NTAwMTMyLCJpYXQiOjE3NDg0OTk4MzIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImI3YWY3NzE3LTUxMzktNGJhMi1hYmZjLTc5ZGYzNGE2MGYxYSIsInN1YiI6InNpbmdodmlzaGFsNjg2MDMwQGdtYWlsLmNvbSJ9LCJlbWFpbCI6InNpbmdodmlzaGFsNjg2MDMwQGdtYWlsLmNvbSIsIm5hbWUiOiJ2aXNoYWwgc2luZ2giLCJyb2xsTm8iOiIyMjAzNDkxNTMwMDU2IiwiYWNjZXNzQ29kZSI6Im5ybXZCTiIsImNsaWVudElEIjoiYjdhZjc3MTctNTEzOS00YmEyLWFiZmMtNzlkZjM0YTYwZjFhIiwiY2xpZW50U2VjcmV0IjoiSHRmVEpaYmdWVVpZRHNrZCJ9.KwTHL9OsE-xMYkdJF6zo6kL1cJgIuPAZFxeTgBYOX_M';

let numberWindow = [];

const typeToEndpoint = {
    p: 'primes',
    f: 'fibo',
    e: 'even',
    r: 'rand'
};

const fetchNumbers = async (type) => {
    const endpoint = typeToEndpoint[type];
    if (!endpoint) return null;

    try {
        const res = await axios.get(`${API_URL}/${endpoint}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        return res.status === 200 ? res.data.numbers : null;
    } catch (err) {
        console.error(`Failed to fetch numbers for type "${type}":`, err.message);
        return null;
    }
};


const updateWindow = (numbers) => {
    numbers.forEach(num => {
        if (!numberWindow.includes(num)) {
            numberWindow.length >= WINDOW_SIZE ? numberWindow.shift() : null;
            numberWindow.push(num);
        }
    });
};

const calculateAverage = () => {
    const sum = numberWindow.reduce((total, n) => total + n, 0);
    return numberWindow.length ? parseFloat((sum / numberWindow.length).toFixed(2)) : 0;
};

app.get('/numbers/:type', async (req, res) => {
    const type = req.params.type;
    const prevState = [...numberWindow];

    const fetchedNumbers = await fetchNumbers(type);
    if (fetchedNumbers) updateWindow(fetchedNumbers);

    res.json({
        windowPrevState: prevState,
        windowCurrState: [...numberWindow],
        numbers: fetchedNumbers || [],
        avg: calculateAverage()
    });
});


app.listen(PORT, () => {
    console.log(`Calculator server is running on port ${PORT}`);
});