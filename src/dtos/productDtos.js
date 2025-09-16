export default class ProductDto {
  constructor(product) {
    this.id = product._id.toString();
    this.name = product.name;
    this.category = product.category;
    this.price = product.price;
    this.stock = product.stock;
  }
}
