export class User {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly lastName: number,
    readonly email: string,
    readonly password: string,
    readonly confirmed: boolean | number,
    readonly timestmap: number
  ) { }
}
