# ChatControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addMembers**](#addmembers) | **POST** /api/chats/{chatId}/members | |
|[**createChat**](#createchat) | **POST** /api/chats | |
|[**deleteChat**](#deletechat) | **DELETE** /api/chats/{chatId} | |
|[**getChatInfo**](#getchatinfo) | **GET** /api/chats/{chatId} | |
|[**getChatList**](#getchatlist) | **GET** /api/chats | |
|[**getChatMessages**](#getchatmessages) | **GET** /api/chats/{chatId}/messages | |
|[**removeMember**](#removemember) | **DELETE** /api/chats/{chatId}/members/{memberId} | |
|[**updateChat**](#updatechat) | **PUT** /api/chats/{chatId} | |

# **addMembers**
> ApiResponseChatDetailResponse addMembers(addMembersRequest)


### Example

```typescript
import {
    ChatControllerApi,
    Configuration,
    AddMembersRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatControllerApi(configuration);

let chatId: string; // (default to undefined)
let addMembersRequest: AddMembersRequest; //

const { status, data } = await apiInstance.addMembers(
    chatId,
    addMembersRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addMembersRequest** | **AddMembersRequest**|  | |
| **chatId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseChatDetailResponse**

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

# **createChat**
> ApiResponseChatDetailResponse createChat(chatCreateRequest)


### Example

```typescript
import {
    ChatControllerApi,
    Configuration,
    ChatCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatControllerApi(configuration);

let chatCreateRequest: ChatCreateRequest; //

const { status, data } = await apiInstance.createChat(
    chatCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatCreateRequest** | **ChatCreateRequest**|  | |


### Return type

**ApiResponseChatDetailResponse**

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

# **deleteChat**
> ApiResponseVoid deleteChat()


### Example

```typescript
import {
    ChatControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatControllerApi(configuration);

let chatId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteChat(
    chatId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatId** | [**string**] |  | defaults to undefined|


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

# **getChatInfo**
> ApiResponseChatDetailResponse getChatInfo()


### Example

```typescript
import {
    ChatControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatControllerApi(configuration);

let chatId: string; // (default to undefined)

const { status, data } = await apiInstance.getChatInfo(
    chatId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseChatDetailResponse**

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

# **getChatList**
> ApiPaginatedResponseListChatListResponse getChatList()


### Example

```typescript
import {
    ChatControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatControllerApi(configuration);

let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getChatList(
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**ApiPaginatedResponseListChatListResponse**

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

# **getChatMessages**
> ApiPaginatedResponseListChatMessageResponse getChatMessages()


### Example

```typescript
import {
    ChatControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatControllerApi(configuration);

let chatId: string; // (default to undefined)
let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getChatMessages(
    chatId,
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatId** | [**string**] |  | defaults to undefined|
| **pageable** | **Pageable** |  | defaults to undefined|


### Return type

**ApiPaginatedResponseListChatMessageResponse**

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

# **removeMember**
> ApiResponseChatDetailResponse removeMember()


### Example

```typescript
import {
    ChatControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatControllerApi(configuration);

let chatId: string; // (default to undefined)
let memberId: string; // (default to undefined)

const { status, data } = await apiInstance.removeMember(
    chatId,
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatId** | [**string**] |  | defaults to undefined|
| **memberId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseChatDetailResponse**

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

# **updateChat**
> ApiResponseChatDetailResponse updateChat(body)


### Example

```typescript
import {
    ChatControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatControllerApi(configuration);

let chatId: string; // (default to undefined)
let body: any; //

const { status, data } = await apiInstance.updateChat(
    chatId,
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **any**|  | |
| **chatId** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseChatDetailResponse**

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

