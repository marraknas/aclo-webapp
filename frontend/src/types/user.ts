export interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  createdAt?: string; // backend currently doesn't return these, but maybe for future improvements
  updatedAt?: string;
}