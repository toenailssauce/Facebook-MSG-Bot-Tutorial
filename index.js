'use strict'

const express 		= require('express')
const bodyParser 	= require('body-parser')
const request 		= require('request')
const app 			= express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello, I am a chat bot.')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'Generic') {
            sendGenericMessage(sender)
            continue
        }
        sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        else if (text === 'dab') {
        	sendTextMessage(sender, "You know\nYou woke up and you don’t know what to do\nAnd you a little hungry\nRap snacks with a dab of ranch\nIt’s just for you")
        }
        else if (text === 'send memes') {
        	var decider = Math.floor(Math.random() * 5);
        	if (decider === 0) sendTextMessage(sender, "✋✋✋✋✋hol' up hol' up ✋✋ looks 👀 like we got a master 🎓 memer 🐸🐸🐸 over here 👈👈👈👩🏼👩🏼hold on to your 👙panties👙ladies!💋💁fuccbois better back the hell ⬆️up⬆️ this absolute 🙀🙀🙀 maaaaaadman!!1! 👹 all you other aspiring 🌽🌽 memers👽👻💀 mmmight as wwwell give up! 👎👎👎👎cuse 👉this guy👈is as good 👌👌👌as it gets! 👏👏👏😹😹")
        	else if (decider === 1) sendTextMessage(sender, "Has anyone really been far even as decided to use even go want to do look more like?")
        	else if (decider === 2) sendTextMessage(sender, "“wtf his ult did like 3k damage how is that legit” – leonardo da vinci 1496, founder of the Illuminati")
        	else if (decider === 3) sendTextMessage(sender, "hi mi name es giorgio i woerk in potatoe faktory and since mi padre died in a donkey waggon accident i leav mi wife and ugli daughter to become a pro leagueue of leyendaerio player, everydai i watch rainamndio. i just wante to sai thank you veriyi much rauinmanio i improvd from bronce 5 to wood 7 in just 6 months. plz no copato pasterato dis is onli my life. i ALso killed mi dog. Sorry fo mi bad englando im not NA")
        	else if (decider === 4) sendTextMessage(sender, "Why am I always being put in the friend zone. I’m a nice guy, work a nice job, and would do anything for m’lady. In the end these girls always go after DOUCHEBAG guys who treat them like shit, and only talk to me to cry about it. I’m sick of being considered ‘beta’ or whatever you call it.")
        }
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  })

const token = 'EAAFj0GL0ZAZAgBAAIylsaqZBap3NRk10Cv4zbGyrd13Nx6VINbTZBd993o7FiZBXZAmzgKUvBfenItL2khl8iZAbcJHtk8RCpQbzxaL5wm7bfxsvNoiLFJZAYlauRj4JxGR68EDeRuKUXZCZBt9NRoZBP8xTHybafp4rGNTvZCZAVRRkZA7AZDZD'

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	console.log('messageData', messageData)
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		console.log('sendTextMessage response', response.body)
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}