export interface IUser {
  id?: string;
  name: string;
  email: string;
  role: {
    name: string;
    code: string;
  };
}
