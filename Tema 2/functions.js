let f = {};

f.get_products = (req, res) => {
    Product = req.Product;
    Product.findAll({
        attributes: ['id', 'name', 'description']
    }).then(products => {
        if (products) {
            res.write(JSON.stringify(products));
            res.end();
        } else {
            res.write('[]');
            res.end();
        }
    });
};

f.get_products_id = (req, res) => {
    const id = req.params.id;
    const Product = req.Product;

    Product.findById(id).then(product => {
        if (product) {
            res.write(
                JSON.stringify({
                    name: product.name,
                    id: product.id,
                    description: product.description
                })
            );
            res.end();
        } else {
            res.statusCode = 404;
            res.write(
                JSON.stringify({
                    message: 'Product not found',
                    status: 'error'
                })
            );
            res.end();
        }
    });
};

f.destroy_all = (req, res) => {
    Product = req.Product;
    Product.destroy({ truncate: true }).then(_ => {
        res.write(
            JSON.stringify({
                message: 'Database was deleted',
                status: 'ok'
            })
        );
        res.end();
    });
};

f.delete_one = (req, res) => {
    Product = req.Product;
    id = req.params.id;
    Product.destroy({ where: { id: id }, truncate: false }).then(_ => {
        res.write(
            JSON.stringify({
                message: 'Product was removed',
                status: 'ok'
            })
        );
        res.end();
    });
};

f.create = (req, res) => {
    let data = [];
    Product = req.Product;

    req
        .on('data', chunk => {
            data.push(chunk);
        })
        .on('end', _ => {
            data = Buffer.concat(data).toString();
            data = JSON.parse(data);
            if (data.id && req.method === 'PUT') {
                Product.findById(data.id)
                    .then(product => {
                        product.update({
                            name: data.name,
                            description: data.description
                        });
                        res.write(JSON.stringify(product));
                        res.end();
                    })
                    .catch(_ => {
                        Product.create({
                            name: data.name,
                            description: data.description
                        }).then(product => {
                            res.write(JSON.stringify(product));
                            res.end();
                        });
                    });
            } else {
                Product.create({
                    name: data.name,
                    description: data.description
                }).then(product => {
                    res.write(JSON.stringify(product));
                    res.end();
                });
            }
        });
};

f.create_all = (req, res) => {
    Product = req.Product;
    let data = [];
    req
        .on('data', chunk => {
            data.push(chunk);
        })
        .on('end', _ => {
            data = Buffer.concat(data).toString();
            data = JSON.parse(data);

            if (Array.isArray(data)) {
                Product.destroy({ truncate: true }).then(_ => {
                    let response = [];
                    Product.bulkCreate(
                        data.map(e => {
                            return {
                                name: e.name,
                                description: e.description
                            };
                        })
                    ).then(products => {
                        res.statusCode = 201;
                        res.write(JSON.stringify(products));
                        res.end();
                    });
                    return response;
                });
            }
        });
};

module.exports = f;
