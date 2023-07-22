export default interface RegisterForm {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | Date;
  pictureUrl: string;
  password: string;
}
