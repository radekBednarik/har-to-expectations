# har-to-expectations

CLI tool to convert HAR file to expectations .json file which is ready for the [Mock-Server](https://www.mock-server.com/mock_server/creating_expectations.html)

Exported .json file is then ready to be either further manually modified or sent to the Mock-Server as is.

You could use [this tool](https://www.npmjs.com/package/@bednarik_radek/mockserver-cli) to handle this easily from CLI.

## Installation

```bash
npm install -g @bednarik_radek/har-to-expectations
```

## Usage

To display CLI help, run:

```bash
npx har -h
```

You should see something like this:

```bash
Usage: har [options] [command]

Options:
  -h, --help                            display help for command

Commands:
  convert <harPath> <jsonPath> <regex>  converts .har file to .json file with expectations.
  help [command]                        display help for command
```

### Example

- we have exported a HAR file from the browser to the `./har` folder
- we want to convert it to the `./expectations` folder

```bash
npx har convert ./har/requests.har ./expectations/expectations.json "https://www.example.com"
```

This command will do the following:

- read the `./har/requests.har` file and parse it to the JSON object with Har typings

- filter out all requests which are not matching the `https://www.example.com` regex

- convert the remaining requests to the JSON object as valid expectations

- save the result to the `./expectations/expectations.json` file

## Important notes

This utility is not doing full `.har`-to-`.json` conversion. It is only converting the requests and responses from the .har. Also, it is only adding certain parts of to expectations from requests/responses, which are needed to use them as mocks.

### What is converted

- request

  - method
  - pathname
  - body, if it is present
  - query parameters, if they are present

- response

  - status code
  - response body, if it is present
