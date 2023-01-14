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
