const Room = require('../models/room')
const OpenAI = require('openai')

module.exports.createNewRoom = async(req, res, next) => {
  const client = new OpenAI({
    apiKey: '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', // This is the default and can be omitted
  });

  async function main() {

    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: `return a javascript array like this: 
        
  [
    { word: '', clue: ''},
    { word: '', clue: ''},
    { word: '', clue: ''},
    { word: '', clue: ''},
    { word: '', clue: ''},
    { word: '', clue: ''},
    { word: '', clue: ''},
    { word: '', clue: ''},
    { word: '', clue: ''},
    { word: '', clue: ''},
  ]

  word and clue keys must not be changed.
  only fill the empty spaces using word of theme ${req.body.theme} on ${req.body.language}.
  DO NOT RETURN NOTHING ELSE
    
      `}],
      model: 'gpt-4o',
    });

    let response = chatCompletion.choices[0].message.content.replace('```javascript', '')
    response = response.replace('```', '')

    return eval(response)

  }

  const themeArray = await main();

  console.log('response: ', themeArray)
  console.log('req.body: ', req.body)
  req.session.data = req.body;
  req.session.data.themeArray = themeArray;
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