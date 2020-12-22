const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../../.env') });
const axios = require('axios');

async function main() {
  try {
    const { data: result } = await axios.get("https://api.medium.com/v1/me", {
      headers: {
        'Authorization': `Bearer ${process.env.MEDIUM_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
      }
    });
    console.log(result.data);
  } catch (err) {
    console.log(err);
  }
}

main();



