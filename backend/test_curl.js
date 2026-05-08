const jwt = require('jsonwebtoken');
process.env.DOTENV_CONFIG_QUIET = "true";
require('dotenv').config({ quiet: true });
const token = jwt.sign({ id: '69baee570b3c70e6cbe48246', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
console.log(token);
