const express = require('express');

const OAuth = require('oauth')
const { promisify } = require('util')

const CONSUMERKEY = 'zyyVL9TdKH0HMKnm1X4wh8ShA';
const CONSUMERSECRET = 'TXZQdWxRrui1qE4SgWjjzITu5XcQ9RMvHrM0eokxvmKFuHgO51';

async function getTwitterUserProfileWithOAuth1 (url) {
  var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    CONSUMERKEY,
    CONSUMERSECRET,
    '1.0A', null, 'HMAC-SHA1'
  )
  const get = promisify(oauth.get.bind(oauth))

  const body = await get(url, undefined, undefined);

  return JSON.parse(body)
}

const app = express();

// app.use(require('body-parser').json());
//var router = express.Router();

//connect path to router
//app.use("/", router);

app.get('/tweets',async (req, res) => {
    const data = await fetchTweets(req.param.username);
    res.json(data);
});

//app.use(require('express-static')('./'));

function fetchTweets(username = 'ishankbahl97') {

    return getTwitterUserProfileWithOAuth1(`https://api.twitter.com/1.1/search/tweets.json?q=${username}`).then(data => {
        if(data.statuses.length) {
            return getTwitterUserProfileWithOAuth1(`https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=${data.statuses[0].user.id}&count=2000`).then(data1 => ({
                7: data.statuses,
                200: data1,
            }));
        }
    }); 
}

// fetchTweets().then(data => console.log(data));
console.log(process.env.PORT || 3000);
app.listen(process.env.PORT || 3000)