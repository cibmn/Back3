export default class UserDto {
  constructor(user) {
    this.id = user._id.toString();
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
    this.pets = user.pets || [];
  }
}
