# ChatMessageResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**messageId** | **string** |  | [optional] [default to undefined]
**senderId** | **string** |  | [optional] [default to undefined]
**senderUsername** | **string** |  | [optional] [default to undefined]
**senderProfileImage** | **string** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**attachments** | [**Array&lt;AttachmentResponse&gt;**](AttachmentResponse.md) |  | [optional] [default to undefined]
**sentAt** | **string** |  | [optional] [default to undefined]
**deleted** | **boolean** |  | [optional] [default to undefined]
**fromMe** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { ChatMessageResponse } from './api';

const instance: ChatMessageResponse = {
    messageId,
    senderId,
    senderUsername,
    senderProfileImage,
    content,
    attachments,
    sentAt,
    deleted,
    fromMe,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
