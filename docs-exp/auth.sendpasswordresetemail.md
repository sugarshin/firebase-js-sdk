<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@firebase/auth](./auth.md) &gt; [sendPasswordResetEmail](./auth.sendpasswordresetemail.md)

## sendPasswordResetEmail() function

Sends a password reset email to the given email address.

<b>Signature:</b>

```typescript
export declare function sendPasswordResetEmail(auth: Auth, email: string, actionCodeSettings?: ActionCodeSettings): Promise<void>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  auth | [Auth](./auth.auth.md) | The Auth instance. |
|  email | string | The user's email address. |
|  actionCodeSettings | [ActionCodeSettings](./auth.actioncodesettings.md) | The [ActionCodeSettings](./auth.actioncodesettings.md)<!-- -->. |

<b>Returns:</b>

Promise&lt;void&gt;

## Remarks

To complete the password reset, call [confirmPasswordReset()](./auth.confirmpasswordreset.md) with the code supplied in the email sent to the user, along with the new password specified by the user.

## Example


```javascript
const actionCodeSettings = {
  url: 'https://www.example.com/?email=user@example.com',
  iOS: {
     bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  handleCodeInApp: true
};
await sendPasswordResetEmail(auth, 'user@example.com', actionCodeSettings);
// Obtain code from user.
await confirmPasswordReset('user@example.com', code);

```

