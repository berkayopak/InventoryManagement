const Product = require('../models').Product;

module.exports = {
    create(req, res) {
        return Product
            .create({
                name: req.body.name,
                price: req.body.price,
                description: req.body.description,
                imageLink: req.body.imageLink
            })
            .then(product => res.status(201).send(product))
            .catch(error => res.status(400).send(error));
    },
    update(req, res) {
        return Product
            .update(req.body, {where:{id: req.param('id')}})
            .then(product => res.status(201).send(product))
            .catch(error => res.status(400).send(error));
    },
    delete(req, res) {
        return Product
            .destroy({where:{id: req.param('id')}})
            .then(product => res.status(201).send(product))
            .catch(error => res.status(400).send(error));
    },
    getAll(req, res) {
        return Product
            .findAll()
            .then(products => res.status(201).send(products))
            .catch(error => res.status(400).send(error));
    }
};