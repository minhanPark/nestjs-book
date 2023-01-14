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
