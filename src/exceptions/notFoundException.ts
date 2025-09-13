export class NotFoundException extends Error {
  constructor() {
    super("Registro não foi encontrado.");
    this.name = "NotFoundException";
  }
}
