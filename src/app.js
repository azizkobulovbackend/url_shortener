const express = require('express')
const app = express()
const fileupload = require('express-fileupload')
const shortid = require('shortid');
const Url = require('./utils/url')
const PORT = 7171
const Io = require('./utils/io')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileupload())
app.set('view engine', 'ejs')

const urlsDb = new Io(`${process.cwd()}/database/urls.json`)

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/shorten', async(req, res) => {
  const urls = await urlsDb.read()
  const {longUrl} = req.body;
  let result = null
  if(!longUrl.startsWith('http')) return res.json({message: 'Url should start with http'})
  const findLongUrl = urls.find((url) => url.longUrl == longUrl);
  result = findLongUrl
  if(findLongUrl) return res.render('result', {result})
  const shortUrl = shortid.generate();
  const newUrl = new Url(shortUrl, longUrl)
  result = newUrl
  console.log(newUrl);
  urls.push(newUrl);
  await urlsDb.write(urls)
  res.render('result', {result} )
    
});

app.get('/:shortUrl', async(req, res) => {
  const urls = await urlsDb.read()
  const {shortUrl} = req.params; 
  const findUrl = urls.find((url) => url.shortUrl == shortUrl);
  if(findUrl) return res.redirect(findUrl.longUrl);
  res.json({message: 'No url with this short url'})
});


app.listen(PORT, (req, res) => {
    console.log(PORT);
})