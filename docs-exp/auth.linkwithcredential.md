<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@firebase/auth](./auth.md) &gt; [linkWithCredential](./auth.linkwithcredential.md)

## linkWithCredential() function

Links the user account with the given credentials.

<b>Signature:</b>

```typescript
export declare function linkWithCredential(user: User, credential: AuthCredential): Promise<UserCredential>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  user | [User](./auth.user.md) | The user. |
|  credential | [AuthCredential](./auth.authcredential.md) | The auth credential. |

<b>Returns:</b>

Promise&lt;[UserCredential](./auth.usercredential.md)<!-- -->&gt;

## Remarks

An [AuthProvider](./auth.authprovider.md) can be used to generate the credential.

