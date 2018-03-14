const http = require('http');
const routes = require('./routes');
const sequelize = require('./sequelize');

const Product = require('./models/products')(sequelize);

const server = http.createServer((req, res) => {
    req.Product = Product;

    const method = req.method;
    const path = req.url;
    const callback = routes.get(req);

    res.setHeader('Content-Type', 'application/json');

    if (callback) {
        callback(req, res);
    } else {
        res.statusCode = 404;
        res.write(
            JSON.stringify({
                status: 'error',
                message: 'Wrong way my friend'
            })
        );
        res.end();
    }
});

server.listen(3000, _ => {
    console.log('Listen to port 3000');
});
