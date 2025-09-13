export class InvalidCredentialsException extends Error {
  constructor() {
    super("Credenciais Inválidas.");
    this.name = "InvalidCredentialsException";
  }
}
