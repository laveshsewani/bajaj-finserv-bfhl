const USER_ID = "lavesh_sewani_14022005";
const EMAIL = "laveshsewani231284@acropolis.in";
const ROLL_NUMBER = "0827AL231123";

function isPrime(n) {
  var num = parseInt(n);
  if (isNaN(num) || num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function processFile(file_b64) {
  if (!file_b64) return { 
    file_valid: false, 
    file_mime_type: null, 
    file_size_kb: null 
  };
  try {
    const buffer = Buffer.from(file_b64, 'base64');
    // size calculate kro
    const sizeKB = (buffer.length / 1024).toFixed(2);
    let mime = 'application/octet-stream';
    if (buffer[0] === 0x89 && buffer[1] === 0x50) mime = 'image/png';
    else if (buffer[0] === 0xFF && buffer[1] === 0xD8) mime = 'image/jpeg';
    else if (buffer[0] === 0x25 && buffer[1] === 0x50) mime = 'application/pdf';
    return { file_valid: true, file_mime_type: mime, file_size_kb: sizeKB };
  } catch (e) {
    return { file_valid: false, file_mime_type: null, file_size_kb: null };
  }
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ operation_code: 1 })
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      const { data, file_b64 } = body;
      console.log("data received", data);

      if (!data || !Array.isArray(data)) {
        return { 
          statusCode: 400, 
          headers,
          body: JSON.stringify({ 
            is_success: false, 
            message: "invalid input" 
          }) 
        };
      }

      const numbers = data.filter(d => !isNaN(d) && d.trim() !== '');
      const alphabets = data.filter(d => /^[a-zA-Z]$/.test(d));
      var lowercaseArr = alphabets.filter(d => /^[a-z]$/.test(d));
      
      // highest lowercase wala
      const highestLowercase = lowercaseArr.length > 0
        ? [lowercaseArr.sort().reverse()[0]] 
        : [];

      const is_prime_found = numbers.some(n => isPrime(n));
      const fileInfo = processFile(file_b64);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          is_success: true,
          user_id: USER_ID,
          email: EMAIL,
          roll_number: ROLL_NUMBER,
          numbers,
          alphabets,
          highest_lowercase_alphabet: highestLowercase,
          is_prime_found,
          ...fileInfo
        })
      };
    } catch (e) {
      return { 
        statusCode: 500, 
        headers,
        body: JSON.stringify({ 
          is_success: false, 
          message: e.message 
        }) 
      };
    }
  }

  return { 
    statusCode: 405, 
    headers, 
    body: JSON.stringify({ message: "method not allowed" }) 
  };
};