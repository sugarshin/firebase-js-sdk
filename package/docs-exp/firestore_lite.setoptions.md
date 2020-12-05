<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@firebase/firestore](./firestore.md) &gt; [lite](./firestore_lite.md) &gt; [SetOptions](./firestore_lite.setoptions.md)

## SetOptions type

An options object that configures the behavior of ,  and  calls. These calls can be configured to perform granular merges instead of overwriting the target documents in their entirety by providing a `SetOptions` with `merge: true`<!-- -->.

<b>Signature:</b>

```typescript
export declare type SetOptions = {
    readonly merge?: boolean;
} | {
    readonly mergeFields?: Array<string | FieldPath>;
};
```