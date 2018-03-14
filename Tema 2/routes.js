const f = require('./functions');

const routes = [
    {
        path: '/products',
        method: 'GET',
        callback: f.get_products
    },
    {
        path: '/product/:id',
        method: 'GET',
        callback: f.get_products_id
    },
    {
        path: '/product',
        method: 'PUT',
        callback: f.create
    },
    {
        path: '/products',
        method: 'PUT',
        callback: f.create_all
    },
    {
        path: '/products',
        method: 'DELETE',
        callback: f.destroy_all
    },
    {
        path: '/product/:id',
        method: 'DELETE',
        callback: f.delete_one
    },
    {
        path: '/product',
        method: 'POST',
        callback: f.create
    }
];

get = req => {
    const components = req.url.split('/');
    let params = {};

    const route = routes.filter(r => {
        const rComponents = r.path.split('/');
        if (components.length !== rComponents.length) {
            return false;
        }

        if (req.method !== r.method) {
            return false;
        }

        for (let i = 0; i < rComponents.length; i++) {
            if (rComponents[i].indexOf(':') === 0) {
                rComponents[i] = rComponents[i].substr(1);
                params[rComponents[i]] = components[i];
                continue;
            }

            if (rComponents[i] !== components[i]) {
                params = {};
                return false;
            }
        }
        return true;
    });

    if (route.length > 0) {
        req.params = params;
        return route[0].callback;
    } else {
        return false;
    }
};

module.exports = {
    get: get
};
