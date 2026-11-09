export class LoginRequest {
  constructor(
    public identifier: string,
    public role: string
  ) {}
}

export class OtpVerifyRequest {
  constructor(
    public identifier: string,
    public role: string,
    public otp: string
  ) {}
}
