# Sliding Window Number Calculator API

This Node.js + Express application fetches numbers from a third-party API and maintains a sliding window of the last 10 **unique** numbers retrieved. It calculates and returns the average of the numbers in the window for each request.

---

## 📦 Features

- Fetches number lists from a third-party API based on ID:
  - `p`: Prime numbers
  - `f`: Fibonacci numbers
  - `e`: Even numbers
  - `r`: Random numbers
- Maintains a sliding window of the **last 10 unique** numbers
- Computes the average of numbers in the window
- Returns previous and current window states

---

## 🔧 Tech Stack

- Node.js
- Express.js
- Axios

