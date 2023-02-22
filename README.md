# 내용 정리

## 타입스크립트

```typescript
interface User {
  name: string;
  age: number;
}
const user: User {
  name: "runningwater",
  age: 1
}
// 인터페이스는 class로도 선언 가능하다.

class User {
  constructor(name: string, age: number) {}
}
const user:User = new User('runningwater', 1)
```

## 데코레이터

> 각 데코레이터의 표현은 위에서 아래로 평가(evaluate) 됩니다.  
> 그런 다음 결과는 아래에서 위로 함수로 호출(call) 됩니다.

데코레이터는 5개가 있다. 사용하는 위치(호출)에 따라서 전달되는 인수도 다르다.

| 데코레이터          | 역할                        | 호출 시 전달되는 인수                   | 선언 불가능한 위치                         |
| ------------------- | --------------------------- | --------------------------------------- | ------------------------------------------ |
| 클래스 데코레이터   | 클래스의 정의를 읽거나 수정 | constructor                             | d.ts 파일, declare 클래스                  |
| 메서드 데코레이터   | 메서드의 정의를 읽거나 수정 | target, propertyKey, propertyDescriptor | d.ts 파일, declare 클래스, 오버로드 메서드 |
| 접근자 데코레이터   | 접근자의 정의를 읽거나 수정 | target, propertyKey, propertyDescriptor | d.ts 파일, declare 클래스                  |
| 속성 데코레이터     | 속성의 정의를 읽음          | target, propertyKey                     | d.ts 파일, declare 클래스                  |
| 매개변수 데코레이터 | 매개변수의 정의를 읽음      | target, propertyKey, parameterIndex     | d.ts 파일, declare 클래스                  |

## 컨트롤러

컨트롤러는 들어오는 요청을 받고, 처리된 결과를 응답으로 돌려주는 인터페이스 역할을 함.

```ts
@Get('he*lo')
getHello(): string {
  return this.appService.getHello();
}
```

위와 같은 형태의 메소드가 들어가는데, \*럼 와일드카드를 이용하여 작성할 수도 있다.

> - 외에 ?, +, () 문자 역시 정규표현식에서의 와일드 카드와 동일하게 동작하는데, 하이픈(-)과 점(.)은 문자열로 취급합니다.  
>   @Get('he.lo')는 hello로 요청할 수 없습니다.

## 리다이렉션

응답을 특정 URL로 리다이렉션 하려면 @Redirect 데코레이터 또는 라이브버리 특정 응답 객체를 사용하면 됩니다.(res.redirect()를 직접 호출 할 수 있습니다.)

> @Redirect 는 2개의 인수를 받습니다. url, statusCode인데 모두 필수는 아니고, 생략된 경우 statusCode의 기본값은 302(Found) 입니다.

```ts
@Redirect('http://localhost:3000', 301)
@Get('/redirect')
findOne() {
  return '리다이렉트';
}
```

> 요청 처리 결과에 따라 동적으로 리다이렉트 하고자 한다면 응답으로 다음과 같은 객체를 리턴하면 됩니다.

```ts
{
  "url": string,
  "statusCode": number;
}
```

## 하위 도메인 라우팅

api.example.com과 example.com이 있다고 가정하자. 또한 하위 도메인에서 처리하지 못한 요청은 원래의 도메인에서 처리되도록 하고 싶다면 어떻게 해야할까?  
이때 사용하는 것이 하위 도메인 라우팅이다.

우선 ApiController가 먼저 처리되도록 순서를 정한다.

```ts
// app.module.ts

@Module({
  imports: [],
  controllers: [ApiController, AppController, UsersController],
  providers: [AppService],
})
```

> 같은 엔드포인트를 사용할 땐 순서를 통해서 처리하나봄.

@Controller는 ControllerOptions 객체를 인수로 받는데 host 속성에 하위 도메인을 기술하면 된다.

```ts
@Controller({ host: 'api.localhost' })
export class ApiController {
  @Get()
  getHello(): string {
    return `Hello API`;
  }
}
```

또한 @HostParam 데코레이터로 서브 도메인을 변수로 받을 수도 있습니다.

```ts
@Controller({ host: ':apiVersion.api.localhost' })
export class ApiController {
  @Get()
  getHello(@HostParam('apiVersion') version: string): string {
    return `Hello API ${version}`;
  }
}
```

위와 같이 해서 버전별로 분리도 가능해진다.

## 파이프

파이프는 요청이 라우터 핸들러로 전달되기 전에 요청 객체를 변환할 수 있는 기회를 제공한다.  
보통 2가지로 사용된다.  
변환(transformation): 입력 데이터를 원하는 형식으로 변환. 예를 들어 /users/user/1 내의 경로 매개변수 문자열 1을 정수로 변환  
유효성 검사(validation): 입력 데이터가 사용자가 정한 기준에 유효하지 않은 경우 예외 처리

```
// 내장 파이트 종류
1. ValidationPipe
2. ParseIntPipe
3. ParseBoolPipe
4. ParseArrayPipe
5. ParseUUIDPipe
6. DefaultValuePipe
```

만약 전달된 id를 매번 정수형으로 변환해 쓰는 것은 불필요한 코드를 반복하는 것이 된다. 그럴땐 파이프를 사용하면 된다.

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number){
  return this.usersService.findOne(id);
}
```

기본적으로 정수로 파싱 가능하지 않은 문자를 넣으면 에러가 난다(파이프가 작동)

```
{
	"statusCode": 400,
	"message": "Validation failed (numeric string is expected)",
	"error": "Bad Request"
}
```

## 전역으로 파이프 사용하기

```ts
// main.ts

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
```

위와 같이 설정하면 useGlobalPipes를 통해서 전역으로 파이프 설정할 수 있다.  
transform: true를 설정해서 class-transformer가 적용되도록 할 수 있다.

## 인증과 인가

인증은 유저나 디바이스의 신원을 증명하는 행위입니다.(인증 - 신분증)  
인가는 유저나 디바이스에게 접근 권한을 부여하거나 거부하는 행위입니다. (인가 - 공연티켓)  
인증은 인가 의사결정의 한 요소가 될 수 있습니다.(신분증을 보고 공연 티켓을 구매했는지 확인해서 공연에 들어갈 수 있게 해준다)  
인가 가공물(토큰)로 유저나 디바이스의 신원을 파악하는 방법은 유용하지 않습니다.
인증과 인가가 실패할 경우의 응답에 대한 http 상태 코드는 각각 401 Unauthorized와 403 Forbidden입니다.

## 윈도우, 맥, 리눅스에서 공통으로 환경 변수 설정

```json
{
  "scripts": {
    "start:dev": "NODE_ENV=development nest start --watch"
  }
}
```

맥이나 리눅스 였다면 위에서처럼 환경 변수를 설정할 수 있지만 윈도우에서는 에러가 난다.

```
'NODE_ENV'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는
배치 파일이 아닙니다.
```

공통적으로 사용하려면 어떻게 해야할까?

cross-env라는 모듈을 사용하면 윈도우, 리눅스, 맥에서 공통적으로 사용할 수 있도록 환경변수를 주입할 수 있다.

[cross-env 보러가기](https://www.npmjs.com/package/cross-env)

```
"start:dev": "cross-env NODE_ENV=development nest start --watch"
```

환경변수 앞에 cross-env를 붙여주면 된다.

```json
{
  "scripts": {
    "build": "cross-env FIRST_ENV=one SECOND_ENV=two node ./my-program"
  }
}
```

여러개 넣으려면 위와 같다.

## 트랜잭션

> 트랜잭션은 요청을 처리하는 과정에서 데이터베이스에 변경이 일어나는 요청을 독립적으로 분리하고 에러가 발생했을 경우 이전 상태로 되돌리게 하기 위해 데이터베이스에서 제공하는 기능이다.

TypeORM에서 트랜잭션을 사용하는 방법은 2가지가 있다.

1. QueryRunner를 이용해서 단일 DB 커넥션 상태를 생성하고 관리
2. transaction 함수를 직접 사용하기

```ts
@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}
  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;
      await queryRunner.manager.save(user);
      new InternalServerErrorException();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
```

dataSource를 받아와서 queryRunner를 실행할 수 있다. 나는 서비스들을 건드려서 롤백까지 가능한 줄 알았는데 db에 변경이 일어나는 것이 아니기 때문에 내가 잘못 이해한 것같음.  
saveUser에 넣어서 만약 에러가 일어나면 유저가 생성되지 않도록 하고 롤백하도록 책에서는 예시를 들었다. 그리고 **에러가 발생해도 메일이 전송되어 버리는데 실제 구현에서는 에러 발생 시 메일 발송이 되지 않도록 처리해보라고 적혀 있었음**  
이때는 리턴값 등을 받아서 만약 오케이가 아니라면 메일이 보내지지 않도록 한다던가 해야할듯 하다.

## 미들웨어

웹 개발에서 일반적으로 미들웨어라 함은 라우트 핸들러가 클라이언트의 요청을 처리하기 전에 수행되는 컴포넌트다.  
미들웨어를 활용하면 다음과 같은 작업들을 수행할 수 있다.

1. 쿠키 파싱: 쿠키를 파싱하여 사용하기 쉬운 데이터 구조로 변경
2. 세션 관리: 세션 쿠키를 찾고, 세션의 상태를 조회해 세션 정보를 추가
3. 인증/인가: 사용자가 서비스에 접근 가능한 권한이 있는지 확인(Nest는 이 때 가드를 이용하도록 권장)
4. 본문 파싱: 데이터를 유형에 따라 읽고 해석한 다음 매개변수에 넣는 작업

두가지 방법으로 넣을 수 있다.

```ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```

위와 같이 클래스 형태로 만들어서 모듈에 적용시키는 방법은 아래와 같다.

```ts
@Module({
  ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('/users');
  }
}
```

위처럼 NestModule을 상속받은 후 configure를 설정해주면 된다.

함수로 만들었다면 전역으로 적용시킬 수 있다.

```ts
export function logger3(req: Request, res: Response, next: NextFunction) {
  console.log('Request3...');
  next();
}
```

위와 같이 함수는 bootstrap 함수에 use를 사용해주면 된다.

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(logger3);
  await app.listen(3000);
}
```
