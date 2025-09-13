export class StatusLockedException extends Error {
  constructor() {
    super("A requisição não pode ser atualizada");
    this.name = "StatusLockedException";
  }
}
