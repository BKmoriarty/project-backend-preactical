export class RefreshToken {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;

  constructor(token: string, userId: number, expiresAt: Date) {
    this.token = token;
    this.userId = userId;
    this.expiresAt = expiresAt;
  }
}
