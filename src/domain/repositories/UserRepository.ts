import { User } from "../entities";

export interface UserRepository {
  // getAll(): Promise<{ Items: User[]; TotalCount: number }>;
  // getById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
