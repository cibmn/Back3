export default class PetDto {
  constructor(pet) {
    this.id = pet._id;
    this.name = pet.name;
    this.species = pet.species;
    this.age = pet.age;
  }
}
