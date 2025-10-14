export default class AdoptionDto {
  constructor(adoption) {
    this.id = adoption._id;
    this.user = adoption.user;
    this.pet = adoption.pet;
    this.date = adoption.date;
  }
}
