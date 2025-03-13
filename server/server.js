const server = require('./app')
const { connectDatabase } = require('./database/db')
const dotenv = require('dotenv')
dotenv.config()
connectDatabase();

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});