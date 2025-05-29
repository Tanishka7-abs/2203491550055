// Calculator App

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;

const WINDOW_SIZE = 10;
const API_URL = 'http://20.244.56.144/evaluation-service';
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ4NTAxNzQyLCJpYXQiOjE3NDg1MDE0NDIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImYzNWQxNDAxLTkzOGEtNDZiNC1iYjlmLTE2MjI0YWNiMDJhOSIsInN1YiI6InRhbmlzaGthZGV2aTE1QGdtYWlsLmNvbSJ9LCJlbWFpbCI6InRhbmlzaGthZGV2aTE1QGdtYWlsLmNvbSIsIm5hbWUiOiJ0YW5pc2hrYSBkZXZpIiwicm9sbE5vIjoiMjIwMzQ5MTU1MDA1NSIsImFjY2Vzc0NvZGUiOiJucm12Qk4iLCJjbGllbnRJRCI6ImYzNWQxNDAxLTkzOGEtNDZiNC1iYjlmLTE2MjI0YWNiMDJhOSIsImNsaWVudFNlY3JldCI6IlVYeFFoV1FEcW5FWnNrVkMifQ.rPGKvaSQfTfDoHO8IOe4dZ6MMJz-bEpI_L-hVxmSC9Q";
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