const Room = require('../models/room')
const OpenAI = require('openai')
require('dotenv').config()

module.exports.createNewRoom = async(req, res, next) => {
  const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });

  async function main() {

    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: `return a javascript array like this: 
  { 
    theme: '',
    language: '',
        
    themeArray:  
      [
        { word: '', clue: ''},
        { word: '', clue: ''},
        { word: '', clue: ''},
        { word: '', clue: ''},
      ]
  }

  the words "theme", "language", "themeArray", "word" and "clue" must not be changed.
  fill the empty spaces of the inner array using ${req.body.nWords} lower-case words with theme ${req.body.theme} on ${req.body.language} and/or add more objects as needed, example:

      [
          { word: 'apple', clue: 'A common red or green fruit that keeps the doctor away.' },
          { word: 'banana', clue: 'A long, yellow fruit that monkeys love.' },
          { word: 'cherry', clue: 'A small, red fruit often found on top of desserts.' },
          { word: 'grape', clue: 'A small, round fruit that can be green or purple and used to make wine.' },
          { word: 'mango', clue: 'A tropical fruit with a sweet, orange flesh and a large seed.' },
          { word: 'orange', clue: 'A citrus fruit known for its vitamin C and juice.' },
          { word: 'strawberry', clue: 'A red fruit with seeds on the outside, often used in shortcakes.' },
          { word: 'pineapple', clue: 'A tropical fruit with a spiky exterior and sweet, yellow flesh.' }
      ]

  if the theme provided does not correspond to a valid theme, use a random theme and fill the "theme" key with the theme you choose, example: theme: 'food'
  if the theme provided correspond to a valid theme, use it and fill the "theme" key with the theme corresponding, example: theme: 'animals'
  if the language provided does not correspond to a valid language, use english: theme: 'english'
  if the language provided correspond to a valid language, fill "language" key with the theme corresponding, example: language: 'russian'.

  THE CLUES ARE MEANT TO BE SHORT.
  DO NOT RETURN NOTHING ELSE
    
      `}],
      model: 'gpt-4o',
    });

    let response = chatCompletion.choices[0].message.content.replace('```javascript', '')
    response = response.replace('```', '')

    console.log('response: ', response)

    return eval('('+response+')' );

  }

  req.session.data = await main();

  const room = new Room(req.session.data)
  await room.save()
  // req.flash('success', 'New room created!');
  console.log(`/play/${room._id}`)
  res.redirect(`/play/${room._id}`);
}

module.exports.showRoom = async(req, res, next) => {
  const room = await Room.findById(req.params.id)
  console.log(room)
  res.render('play', {data: req.session.data}) 
}