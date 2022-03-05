/* LunchBot - A Discord chat bot that tells you where to eat.
 * 
 * Followed instructions from:
 * https://medium.com/@renesansz/tutorial-creating-a-simple-discord-bot-9465a2764dc0
 */

var Discord = require('discord.io');
var auth    = require('./auth.json');
var request = require('request');

const getLogPrefix = function () {
    const datetime = new Date();
    const date = datetime.toISOString().split('T')[0];
    const time = datetime.toString().split(' ')[4];
    return '[' + date + ' ' + time + '] ';
}

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ' + bot.username + ' (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    message = message.toLowerCase().replace(/'|‘|’/g, '');
    var someoneIsHungry =
            message.search(/(?:i am|im|meesa) (?:so+ )?hungry/) >= 0 ||
            message.search(/.+ for (?:breakfast|brunch|lunch|dinner|supper)/) >= 0 ||
            message.search(/i (?:want|need) (?:some )?food/) >= 0;
    
    if (!someoneIsHungry) {
        return;
    }
    console.log(getLogPrefix() + user + ' is hungry!');
    
    // TODO: This
    var isCalvin = false;
    
    // Define function to send messages to Discord
    var sendMessage = function (m) {
        bot.sendMessage({to: channelID, message: m});
    }
    
    // Send a random starting message
    var startingMessages = [
        'Let me think...',
        'Let me see what I can find...',
        'Let\'s see...',
        'Suggestions coming right up!',
        'Silly humans, always needing food to survive...'
    ]
    sendMessage(startingMessages[Math.floor(Math.random() * startingMessages.length)]);
    
    var yelpSearchUrl = 'https://api.yelp.com/v3/businesses/search?term=restaurant&latitude=34.705053&longitude=-82.882667&radius=10000&limit=50&price=1,2,3&open_now=true';
    request(
        {
            url: yelpSearchUrl,
            headers: {
                'Authorization': 'Bearer ' + auth['yelp_api_key']
            }
        },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                sendMessage('Sorry, something went wrong...  I had ONE job :sob:');
                return;
            }
            
            body = JSON.parse(body);
            
            // Get number of businesses
            var businessCount = body['businesses'].length;
            if (businessCount == 0) {
                sendMessage('Sorry, looks like nobody is open :joy:');
                return;
            }
            
            // Randomly select indices of up to 3 businesses
            var businesses = body['businesses']
            var selections = [];
            var selectionCount = Math.min(3, businessCount);
            while (selections.length < selectionCount) {
                var selection = Math.floor(Math.random() * businesses.length);
                if (selections.indexOf(selection) == -1) {
                    selections.push(selection);
                }
            }
            
            // Display selected businesses
            message = '';
            var i;
            for (i in selections) {
                var business = businesses[selections[i]];
                var miles    = (business['distance'] * 0.000621371).toFixed(1); // Meters to miles
                message += '\n{}. **{}** ({} mi, {}, {} stars)'
                        .replace('{}', parseInt(i) + 1)
                        .replace('{}', business['name'])
                        .replace('{}', miles)
                        .replace('{}', business['price'])
                        .replace('{}', business['rating']);
            }
            sendMessage(message.substring(1));
        }
    );
});

