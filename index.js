const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const THIRD_PARTY_API_BASE_URL = 'http://20.244.56.144/evaluation-service';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ4NTAwMTMyLCJpYXQiOjE3NDg0OTk4MzIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImI3YWY3NzE3LTUxMzktNGJhMi1hYmZjLTc5ZGYzNGE2MGYxYSIsInN1YiI6InNpbmdodmlzaGFsNjg2MDMwQGdtYWlsLmNvbSJ9LCJlbWFpbCI6InNpbmdodmlzaGFsNjg2MDMwQGdtYWlsLmNvbSIsIm5hbWUiOiJ2aXNoYWwgc2luZ2giLCJyb2xsTm8iOiIyMjAzNDkxNTMwMDU2IiwiYWNjZXNzQ29kZSI6Im5ybXZCTiIsImNsaWVudElEIjoiYjdhZjc3MTctNTEzOS00YmEyLWFiZmMtNzlkZjM0YTYwZjFhIiwiY2xpZW50U2VjcmV0IjoiSHRmVEpaYmdWVVpZRHNrZCJ9.KwTHL9OsE-xMYkdJF6zo6kL1cJgIuPAZFxeTgBYOX_M';
let numberWindow = [];

const fetchNumbers = async (numberId) => {
    let url = '';
    switch (numberId) {
        case 'p':
            url = ${THIRD_PARTY_API_BASE_URL}/primes;
            break;
        case 'f':
            url = ${THIRD_PARTY_API_BASE_URL}/fibo;
            break;
        case 'e':
            url = ${THIRD_PARTY_API_BASE_URL}/even;
            break;
        case 'r':
            url = ${THIRD_PARTY_API_BASE_URL}/rand;
            break;
        default:
            return null; 
    }

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': Bearer ${ACCESS_TOKEN}
            },
        });
        if (response.status === 200 && response.data) {
            return response.data.numbers;
        } else {
            return null; 
        }
    } catch (error) {
     
        return null;
    }
};

app.get('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid;  
    console.log(numberId);
    const windowPrevState = [...numberWindow];

    const newNumbers = await fetchNumbers(numberId);

    if (newNumbers) {

        newNumbers.forEach(num => {
            if (!numberWindow.includes(num)) {
                if (numberWindow.length < WINDOW_SIZE) {
                    numberWindow.push(num);
                } else {
                    numberWindow.shift();
                    numberWindow.push(num);
                }
            }
        });
    }

    const windowCurrState = [...numberWindow]; 


    const sum = numberWindow.reduce((acc, num) => acc + num, 0);
    const avg = numberWindow.length > 0 ? sum / numberWindow.length : 0;

    res.json({
        windowPrevState: windowPrevState,
        windowCurrState: windowCurrState,
        numbers: newNumbers,
        avg: parseFloat(avg.toFixed(2)) 
    });
});

app.listen(PORT, () => {
    console.log(Port ${PORT});
    });
