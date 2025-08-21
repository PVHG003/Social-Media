# CommentControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createComment**](#createcomment) | **POST** /api/posts/{postId}/comments | |
|[**deleteComment**](#deletecomment) | **DELETE** /api/comments/{commentId} | |
|[**getComment**](#getcomment) | **GET** /api/comments/{commentId} | |
|[**getCommentsByPost**](#getcommentsbypost) | **GET** /api/posts/{postId}/comments | |
|[**getCommentsByUser**](#getcommentsbyuser) | **GET** /api/users/{userId}/comments | |
|[**updateComment**](#updatecomment) | **PUT** /api/comments/{commentId} | |

# **createComment**
> ApiResponseCommentResponseDto createComment(commentRequestDto)


### Example

```typescript
import {
    CommentControllerApi,
    Configuration,
    CommentRequestDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let postId: string; // (default to undefined)
let commentRequestDto: CommentRequestDto; //

const { status, data } = await apiInstance.createComment(
    postId,
    commentRequestDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentRequestDto** | **CommentRequestDto**|  | |
| **postId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseCommentResponseDto**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteComment**
> ApiResponseVoid deleteComment()


### Example

```typescript
import {
    CommentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let commentId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteComment(
    commentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseVoid**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getComment**
> ApiResponseCommentResponseDto getComment()


### Example

```typescript
import {
    CommentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let commentId: string; // (default to undefined)

const { status, data } = await apiInstance.getComment(
    commentId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseCommentResponseDto**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCommentsByPost**
> ApiPaginatedResponseListCommentResponseDto getCommentsByPost()


### Example

```typescript
import {
    CommentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let postId: string; // (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getCommentsByPost(
    postId,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postId** | [**string**] |  | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 10|


### Return type

**ApiPaginatedResponseListCommentResponseDto**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCommentsByUser**
> ApiPaginatedResponseListCommentResponseDto getCommentsByUser()


### Example

```typescript
import {
    CommentControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let userId: string; // (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getCommentsByUser(
    userId,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 10|


### Return type

**ApiPaginatedResponseListCommentResponseDto**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateComment**
> ApiResponseCommentResponseDto updateComment(commentUpdateDto)


### Example

```typescript
import {
    CommentControllerApi,
    Configuration,
    CommentUpdateDto
} from './api';

const configuration = new Configuration();
const apiInstance = new CommentControllerApi(configuration);

let commentId: string; // (default to undefined)
let commentUpdateDto: CommentUpdateDto; //

const { status, data } = await apiInstance.updateComment(
    commentId,
    commentUpdateDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **commentUpdateDto** | **CommentUpdateDto**|  | |
| **commentId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseCommentResponseDto**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

