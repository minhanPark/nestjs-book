import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}
  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private checkUserExists(email: string) {
    return false;
  }

  private saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    return;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // 1. DB에서 signupVerifyToken으로 회원가입 처리 중인 유저가 있는 지 조회하고 없다면 에러처리
    // 2. 바로 로그인 상태가 되도록 JWT를 발급
    // const user = await this.user
    throw new Error('Method not impletement');
  }

  async login(email: string, password: string): Promise<string> {
    // 1. 이메일, 패스워드를 가진 유저가 존재하는 지 DB에서 확인하고 없다면 에러처리
    // 2. JWT를 발급
    throw new Error('Method not implemented.');
  }
}
