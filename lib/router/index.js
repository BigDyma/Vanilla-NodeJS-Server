const tokens = require('./tokens');
const users = require('./users');
const others = require('./others');

const router = {
    'users': users,
    'tokens': tokens
};

Object.assign(router, others);


module.exports = router;
