const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
// pathes for data directory and products.json file
const dataDir = path.join(__dirname, "..", "data");
const filePath = path.join(dataDir, "products.json");
// function to read products from the JSON file
const readProducts = () => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (err) {
    return [];
  }
};
class Product {
  constructor(title, price, imageUrl, description) {
    this.id = crypto.randomUUID(); // generate a unique ID for each product
    this.title = title;
    this.price = Number(price);
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    const products = readProducts();
    products.push(this);
    // create the data directory if it doesn't exist
    fs.mkdirSync(dataDir, { recursive: true });
    // write the updated products array to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(products));
  }

  static fetchAll() {
    // return the products read from the JSON file
    return readProducts();
  }

  static findById(id) {
    return readProducts().find((product) => product.id === id);
  }
}

module.exports = Product;
