<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@firebase/messaging](./messaging.md) &gt; [getToken](./messaging.gettoken.md)

## getToken() function

Subscribes the messaging instance to push notifications. Returns an FCM registration token that can be used to send push messages to that messaging instance.

If a notification permission isn't already granted, this method asks the user for permission. The returned promise rejects if the user does not allow the app to show notifications.

<b>Signature:</b>

```typescript
export declare function getToken(messaging: FirebaseMessaging, options?: {
    vapidKey?: string;
    swReg?: ServiceWorkerRegistration;
}): Promise<string>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  messaging | [FirebaseMessaging](./messaging.firebasemessaging.md) | the messaging instance. |
|  options | { vapidKey?: string; swReg?: ServiceWorkerRegistration; } |  |

<b>Returns:</b>

Promise&lt;string&gt;

The promise resolves with an FCM registration token.

