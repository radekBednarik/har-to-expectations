import { Har } from "har-format";

export interface MockExpectation {
  httpRequest: HttpRequest;
  httpResponse: HttpResponse;
}

export interface HttpRequest {
  method: string;
  path: string;
  body?: string | Record<string, unknown>;
  queryStringParameters?: Record<string, string[]>;
}

export interface HttpResponse {
  statusCode: number;
  body?: string | Record<string, unknown>;
}

export function parser(harObject: Har) {
  const entries = harObject.log.entries;

  if (entries.length === 0) {
    return null;
  }

  const expectations: MockExpectation[] = [];

  for (const entry of entries) {
    const request = entry.request;
    const requestQueryParams = request.queryString;
    const response = entry.response;

    const expectation: MockExpectation = {
      httpRequest: {
        method: request.method,
        path: getRequestPath(request.url),
      },
      httpResponse: {
        statusCode: response.status,
      },
    };

    if (requestQueryParams.length > 0) {
      expectation.httpRequest.queryStringParameters = getQueryParameters(requestQueryParams);
    }

    if (typeof response.content.text !== "undefined") {
      expectation.httpResponse.body = getResponseBody(response.content.text);
    }

    if (typeof request.postData?.text !== "undefined") {
      expectation.httpRequest.body = getRequestBody(request.postData.text);
    }

    expectations.push(expectation);
  }

  return expectations;
}

function getQueryParameters(queryParams: any[]) {
  if (queryParams.length === 0) {
    return undefined;
  }

  const queryParameters: Record<string, string[]> = {};

  for (const param of queryParams) {
    const name = param.name;
    const value = param.value;

    if (Object.prototype.hasOwnProperty.call(queryParameters, name)) {
      queryParameters[name]!.push(value);
    } else {
      queryParameters[name] = [value];
    }
  }

  return queryParameters;
}

function getRequestPath(url: string) {
  const urlObject = new URL(url);
  return urlObject.pathname;
}

function getResponseBody(body: string) {
  try {
    return JSON.parse(body);
  } catch (err: any) {
    if (typeof body === "string") {
      return body;
    }
  }
}

function getRequestBody(body: string) {
  try {
    return {
      type: "JSON",
      json: JSON.parse(body),
      matchType: "STRICT",
    };
  } catch (err: any) {
    if (typeof body === "string") {
      return body;
    }
  }

  return {};
}
