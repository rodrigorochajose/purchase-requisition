export class StatusApprovalException extends Error {
  constructor(status: string) {
    super(`Status anterior precisa ser : '${status}'`);
    this.name = "StatusApprovalException";
  }
}
