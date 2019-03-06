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
            .update(req.body, {where:{id: req.query.id}}, {exclude: ["imageLink"]})
            .then(function(success){
                if(success == 1) {
                    res.sendStatus(201);
                }
                else {
                    res.sendStatus(400);
                }
            })
            .catch(error => res.status(400).send(error));
    },
    delete(req, res) {
        return Product
            .destroy({where:{id: req.query.id}})
            .then(result => res.status(201).send(result))
            .catch(result => res.status(400).send(result));
    },
    getAll(req, res) {
        return Product
            .findAll()
            .then(products => res.status(201).send(products))
            .catch(error => res.status(400).send(error));
    },
    upload(req, res, next) {
        var imageUrl = "http://localhost:4000/files/"+req.file.filename;
        return Product
            .update({imageLink:imageUrl}, {where:{id: req.query.itemId}})
            .then(function(success){
                if(success == 1) {
                    res.status(201).send(success);
                }
                else {
                    res.status(400).send(success);
                }
            })
            .catch(function(error){
                res.status(400).send(error)
            });
    }
};