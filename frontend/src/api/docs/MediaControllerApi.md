# MediaControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getFile**](#getfile) | **GET** /api/v1/files/{fileName} | |
|[**uploadAttachments**](#uploadattachments) | **POST** /api/v1/files/chats/{chatId}/attachments | |
|[**uploadGroupImage**](#uploadgroupimage) | **POST** /api/v1/files/chats/{chatId}/group-image | |

# **getFile**
> object getFile()


### Example

```typescript
import {
    MediaControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaControllerApi(configuration);

let fileName: string; // (default to undefined)

const { status, data } = await apiInstance.getFile(
    fileName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fileName** | [**string**] |  | defaults to undefined|


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadAttachments**
> object uploadAttachments()


### Example

```typescript
import {
    MediaControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaControllerApi(configuration);

let chatId: string; // (default to undefined)
let files: Array<File>; // (default to undefined)

const { status, data } = await apiInstance.uploadAttachments(
    chatId,
    files
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatId** | [**string**] |  | defaults to undefined|
| **files** | **Array&lt;File&gt;** |  | defaults to undefined|


### Return type

**object**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadGroupImage**
> ApiResponseChatDetailResponse uploadGroupImage()


### Example

```typescript
import {
    MediaControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MediaControllerApi(configuration);

let chatId: string; // (default to undefined)
let files: File; // (default to undefined)

const { status, data } = await apiInstance.uploadGroupImage(
    chatId,
    files
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatId** | [**string**] |  | defaults to undefined|
| **files** | [**File**] |  | defaults to undefined|


### Return type

**ApiResponseChatDetailResponse**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

