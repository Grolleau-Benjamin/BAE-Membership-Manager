export default interface User {
  _id: string;
  username: string;
  role: "admin" | "user";
  password?: string;
}
