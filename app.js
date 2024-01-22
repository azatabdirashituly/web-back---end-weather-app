const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/pages/index.html');
});

app.post('/', async (req, res) => {
  const city = req.body.city;
  const weatherApiKey = "0220b2ecd57ffeff232b00b52385a170";
  const pexelsApiKey = "yMFEy3CCfkwOB1Oa1nwpfv3deKDel25h3Gz3tImEp59zejRv9Ykfxb5i";
  
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
  const pexelsUrl = `https://api.pexels.com/v1/search?query=${city}&per_page=3&page=1`;

  try {
    const weatherData = await fetchApi(weatherUrl);
    const imageData = await fetchApi(pexelsUrl, {
      'Authorization': `${pexelsApiKey}`
    });
    res.redirect(`/?weatherData=${encodeURIComponent(JSON.stringify(weatherData))}&imageData=${encodeURIComponent(JSON.stringify(imageData))}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error fetching data.');
  }
});

function fetchApi(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject('Error parsing data');
        }
      });

    }).on('error', (error) => {
      reject('API request error');
    });
  });
}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
