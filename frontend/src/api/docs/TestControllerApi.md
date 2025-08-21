# TestControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**ping**](#ping) | **GET** /api/test/ping | |

# **ping**
> string ping()


### Example

```typescript
import {
    TestControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestControllerApi(configuration);

const { status, data } = await apiInstance.ping();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

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

