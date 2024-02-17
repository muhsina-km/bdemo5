const axios = require('axios');

async function identifyPlant(imageUrl) {
  const apiKey = '2b10VyoqAWWYdhTk6g132g3y';
  const apiUrl = `https://my-api.plantnet.org/v2/identify/all?images=${encodeURIComponent(imageUrl)}&include-related-images=false&no-reject=false&lang=en&api-key=${apiKey}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        'accept': 'application/json'
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error identifying plant:', error);
    return null;
  }
}

module.exports = { identifyPlant };
