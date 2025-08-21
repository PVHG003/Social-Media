# PostControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createPost**](#createpost) | **POST** /api/posts | |
|[**deletePost**](#deletepost) | **DELETE** /api/posts/{postId} | |
|[**getAllPosts**](#getallposts) | **GET** /api/posts | |
|[**getPost**](#getpost) | **GET** /api/posts/{postId} | |
|[**getPostsByUser**](#getpostsbyuser) | **GET** /api/posts/user/{userId} | |
|[**likePost**](#likepost) | **POST** /api/posts/{postId}/like | |
|[**unlikePost**](#unlikepost) | **DELETE** /api/posts/{postId}/like | |
|[**updatePost**](#updatepost) | **PUT** /api/posts/{postId} | |

# **createPost**
> ApiResponsePostResponse createPost()


### Example

```typescript
import {
    PostControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PostControllerApi(configuration);

let content: string; // (optional) (default to undefined)
let mediaFiles: Array<File>; // (optional) (default to undefined)

const { status, data } = await apiInstance.createPost(
    content,
    mediaFiles
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **content** | [**string**] |  | (optional) defaults to undefined|
| **mediaFiles** | **Array&lt;File&gt;** |  | (optional) defaults to undefined|


### Return type

**ApiResponsePostResponse**

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

# **deletePost**
> ApiResponseVoid deletePost()


### Example

```typescript
import {
    PostControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PostControllerApi(configuration);

let postId: string; // (default to undefined)

const { status, data } = await apiInstance.deletePost(
    postId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postId** | [**string**] |  | defaults to undefined|


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

# **getAllPosts**
> ApiPaginatedResponseListPostResponse getAllPosts()


### Example

```typescript
import {
    PostControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PostControllerApi(configuration);

let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getAllPosts(
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 10|


### Return type

**ApiPaginatedResponseListPostResponse**

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

# **getPost**
> ApiResponsePostResponse getPost()


### Example

```typescript
import {
    PostControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PostControllerApi(configuration);

let postId: string; // (default to undefined)

const { status, data } = await apiInstance.getPost(
    postId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponsePostResponse**

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

# **getPostsByUser**
> ApiPaginatedResponseListPostResponse getPostsByUser()


### Example

```typescript
import {
    PostControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PostControllerApi(configuration);

let userId: string; // (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getPostsByUser(
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

**ApiPaginatedResponseListPostResponse**

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

# **likePost**
> ApiResponsePostResponse likePost()


### Example

```typescript
import {
    PostControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PostControllerApi(configuration);

let postId: string; // (default to undefined)

const { status, data } = await apiInstance.likePost(
    postId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponsePostResponse**

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

# **unlikePost**
> ApiResponsePostResponse unlikePost()


### Example

```typescript
import {
    PostControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PostControllerApi(configuration);

let postId: string; // (default to undefined)

const { status, data } = await apiInstance.unlikePost(
    postId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponsePostResponse**

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

# **updatePost**
> ApiResponsePostResponse updatePost(postUpdateRequest)


### Example

```typescript
import {
    PostControllerApi,
    Configuration,
    PostUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PostControllerApi(configuration);

let postId: string; // (default to undefined)
let postUpdateRequest: PostUpdateRequest; //

const { status, data } = await apiInstance.updatePost(
    postId,
    postUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postUpdateRequest** | **PostUpdateRequest**|  | |
| **postId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponsePostResponse**

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

