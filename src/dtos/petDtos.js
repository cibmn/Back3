export default class petDto {
  constructor(pet) {
    this.id = pet._id.toString();
    this.name = pet.name;
    this.category = pet.category;
    this.price = pet.price;
    this.stock = pet.stock;
  }
}
