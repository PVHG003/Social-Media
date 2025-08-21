# PostResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**author** | [**UserDto**](UserDto.md) |  | [optional] [default to undefined]
**mediaFiles** | [**Array&lt;MediaDto&gt;**](MediaDto.md) |  | [optional] [default to undefined]
**likeCount** | **number** |  | [optional] [default to undefined]
**commentCount** | **number** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**liked** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { PostResponse } from './api';

const instance: PostResponse = {
    id,
    content,
    author,
    mediaFiles,
    likeCount,
    commentCount,
    createdAt,
    updatedAt,
    liked,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
