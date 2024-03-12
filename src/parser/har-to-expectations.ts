import { Har } from "har-format";
import { logger } from "../logger/logger.js";
import ProgressBar from "../cli/progress-bar.js";
import lodash from "lodash";

const log = logger.child({ module: "parser-har-to-expectations" });

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

export function parser(harObject: Har, regex: string) {
  try {
    log.info("Parsing HAR file to expectations");
    log.debug(`HAR file content: ${JSON.stringify(harObject)}`);

    const entries = harObject.log.entries;

    if (entries.length === 0) {
      log.warn("No entries found in the HAR file");

      return null;
    }

    const expectations: MockExpectation[] = [];
    const regexPattern = new RegExp(regex);
    const progressBar = new ProgressBar(process.env["LOG_ENABLED"]);

    progressBar.start(entries.length);

    for (const entry of entries) {
      progressBar.increment();

      log.debug(`Parsing HAR entry: ${JSON.stringify(entry)}`);

      const request = entry.request;
      const requestUrl = request.url;

      if (!regexPattern.test(requestUrl)) {
        continue;
      }

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
      log.debug(`Expectation parsed to: ${JSON.stringify(expectation)}`);
    }

    progressBar.stop();

    log.debug(`Expectations array with expectations: ${expectations}`);
    log.info("Har entries parsed to expectations array.");

    return expectations;
  } catch (error: any) {
    log.error(`Error when parsing Har data: ${JSON.stringify(error)}`);
    throw error;
  }
}

export function merger(
  existingJsonObject: MockExpectation[],
  parsedHarObject: MockExpectation[],
  update: boolean,
): MockExpectation[] {
  try {
    const bar = new ProgressBar(process.env["LOG_ENABLED"]);
    bar.start(parsedHarObject.length);

    log.info(`merging ${JSON.stringify(parsedHarObject)} into ${JSON.stringify(existingJsonObject)}`);

    for (const expectation of parsedHarObject) {
      bar.increment();

      for (const existingExpectation of existingJsonObject) {
        // it is the same expectation request
        // and we do not want to update
        if (isEqual(expectation.httpRequest, existingExpectation.httpRequest) && !update) {
          break;
        }

        // it is the same expectation request
        // and we want to update
        if (isEqual(expectation.httpRequest, existingExpectation.httpRequest) && update) {
          existingExpectation.httpResponse = expectation.httpResponse;
          break;
        }
      }

      // new expectation - so just add
      existingJsonObject.push(expectation);
    }

    bar.stop();

    log.info(`merge finished with result object: ${JSON.stringify(existingJsonObject)}`);

    return existingJsonObject;
  } catch (error) {
    log.error(`error in func merger: ${error}`);
    throw error;
  }
}

function isEqual(obj1: HttpRequest, obj2: HttpRequest) {
  if (lodash.isEqual(obj1, obj2)) {
    return true;
  }

  return false;
}

function getQueryParameters(queryParams: any[]) {
  log.info("Parsing query parameters");
  log.debug(`Query parameters: ${JSON.stringify(queryParams)}`);

  try {
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
    log.info("Query parameters parsed");
    log.debug(`Query parameters parsed to: ${JSON.stringify(queryParameters)}`);

    return queryParameters;
  } catch (error: any) {
    log.error(`Error when parsing query parameters: ${JSON.stringify(error)}`);
    throw error;
  }
}

function getRequestPath(url: string) {
  try {
    const urlObject = new URL(url);
    return urlObject.pathname;
  } catch (error: any) {
    log.error(`Error when parsing request path: ${JSON.stringify(error)}`);
    throw error;
  }
}

function getResponseBody(body: string) {
  log.info("Parsing response body");
  log.debug(`Response body: ${JSON.stringify(body)}`);

  try {
    return JSON.parse(body);
  } catch (err: any) {
    if (typeof body === "string") {
      return body;
    }
  }
}

function getRequestBody(body: string) {
  log.info("Parsing request body");
  log.debug(`Request body: ${JSON.stringify(body)}`);

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
