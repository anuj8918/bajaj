const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mime = require('mime-types');

const app = express();
app.use(bodyParser.json());

const upload = multer(); // To handle file uploads

// Helper: Check if a number is prime
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// Route: POST /bfhl
app.post('/bfhl', upload.single('file'), (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: 'Invalid input data' });
  }

  const numbers = data.filter((item) => /^\d+$/.test(item));
  const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));
  const highestLowerCase = alphabets
    .filter((char) => char === char.toLowerCase())
    .sort((a, b) => b.localeCompare(a))[0];

  const primeFound = numbers.some((num) => isPrime(parseInt(num, 10)));

  let fileValid = false;
  let fileMimeType = null;
  let fileSizeKB = null;

  if (file_b64) {
    try {
      const buffer = Buffer.from(file_b64, 'base64');
      fileMimeType = mime.lookup(buffer);
      fileSizeKB = buffer.length / 1024;
      fileValid = true;
    } catch {
      fileValid = false;
    }
  }

  res.json({
    is_success: true,
    user_id: 'john_doe_17091999',
    email: 'john@xyz.com',
    roll_number: 'ABCD123',
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowerCase ? [highestLowerCase] : [],
    is_prime_found: primeFound,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB,
  });
});

// Route: GET /bfhl
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
