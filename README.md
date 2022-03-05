# LunchBot
A Discord chatbot that tells you where to eat.

If somebody types something like "I'm hungry" or "I need some food" into the chat, LunchBot will find three random
restaurants nearby that are currently open, and list them in the chat.

Example:

> _[User]_ I'm sooo hungry! \
> _[LunchBot]_ Let me see what I can find... \
> _[LunchBot]_ 1. **Acme's Deli** (4.5 miles, $, 3 stars) \
> _[LunchBot]_ 2. **Foo's Bar** (1.2 miles, $$, 5 stars) \
> _[LunchBot]_ 3. **Foody McFoodface** (7.0 miles, $$$, 4 stars)

LunchBot uses the [Yelp API](https://www.yelp.com/developers/documentation/v3/business_search) to find nearby restaurants and
their associated information.

## Files

- `bot.js` contains the bulk of the code for the LunchBot.
- `run.py` runs LunchBot, and will re-launch it in the event of a crash, until it receives a Ctrl-C.
- `config.json` contains settings for `latitude`, `longitude`, and `radiusMeters` for the search. This needs to be
  updated with your location to get local results.
- `auth.json` (not configured for security reasons) contains a JSON object structured like so:
  ```json
  {"token": "<Discord auth token>", "yelp_api_key": "<Yelp API key>"}
  ```
