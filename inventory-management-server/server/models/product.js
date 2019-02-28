'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    price: {
      allowNull: false,
      type: DataTypes.DOUBLE
    },
    description: {
      type: DataTypes.STRING
    },
    imageLink: {
      type: DataTypes.STRING
    },

  }, {});
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};