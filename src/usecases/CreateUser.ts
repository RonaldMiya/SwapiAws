import { v4 as uuid } from 'uuid';
import { UserRepository } from '../domain/repositories';
import { User } from '../domain/entities';
import { HashService } from '../domain/services/HashService';

interface Input {
  name: string;
  lastName: number;
  email: string;
  password: string;
}

export class CreateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService
  ) { }

  async execute(input: Input): Promise<User> {
    const hashedPassword = await this.hashService.hash(input.password);
    const userData = new User(
      uuid(),
      input.name,
      input.lastName,
      input.email,
      hashedPassword,
      false,
      Date.now()
    );

    return await this.userRepository.create(userData)
  }
}
