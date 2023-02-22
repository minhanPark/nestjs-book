import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import * as uuid from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserInfo } from './dto/user-info.dto';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private authService: AuthService,
  ) {}
  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }
    const signupVerifyToken = uuid.v1();

    const result = await this.saveUser(
      name,
      email,
      password,
      signupVerifyToken,
    );
    if (result) {
      await this.sendMemberJoinEmail(email, signupVerifyToken);
    }
  }

  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user !== null;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    let isSuccess = false;
    try {
      const user = new UserEntity();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;
      //await queryRunner.manager.save(user);
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      isSuccess = true;
      // throw new InternalServerErrorException();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      isSuccess = false;
    } finally {
      await queryRunner.release();
      return isSuccess;
    }
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
    const user = await this.usersRepository.findOne({
      where: {
        signupVerifyToken,
      },
    });
    if (!user) {
      throw new Error('Method not impletement');
    }

    return this.authService.login({
      id: `${user.id}`,
      name: user.name,
      email: user.email,
    });
  }

  async emailCheck(token: string) {
    return token;
  }

  async login(email: string, password: string): Promise<string> {
    // 1. 이메일, 패스워드를 가진 유저가 존재하는 지 DB에서 확인하고 없다면 에러처리
    // 2. JWT를 발급
    const user = await this.usersRepository.findOne({
      where: { email, password },
    });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    return this.authService.login({
      id: `${user.id}`,
      name: user.name,
      email: user.email,
    });
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    const user = await this.usersRepository.findOne({
      where: { id: +userId },
    });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }
    return {
      id: String(user.id),
      name: user.name,
      email: user.email,
    };
  }
}
