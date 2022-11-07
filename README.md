# Homework 6B: Promises and Web Programming

- TODO
  - Make project zip
  - Final read through
  
## Notes

- Please download the homework from [here](./hw6-part-b-fall-22.zip)
- This project will be using Node.js and VSCode
  - Reference the [previous homeworks installation instructions](https://github.com/umass-compsci-220/hw6-part-a-fall-22/blob/main/INSTALLATION.md) if need help getting everything installed
- After you download and unzip the project, open the folder one level higher than the `/src` folder in VSCode (File -> Open Folder)
- Run `npm install` inside the terminal (Terminal -> New Terminal)
- Your directory should look something like this:

```txt
hw6-part-b-fall-22/
  node_modules/
  src/
    main.js
  package-lock.json
  package.json
```

## Index

- [Description](#description)
- [Learning Objectives](#learning-objectives)
- [Student Expectations](#student-expectations)
- [Getting Started](#getting-started)
  - [URLs and Parameters](#urls-and-parameters)
  - [Third-party APIs](#third-party-apis)
  - [Fetching Resources](#fetching-resources)
- [File Overview](#file-overview)
  - [`npm` commands](#npm-commands)
- [Programming Tasks](#programming-tasks)
  - [`fetchLongitudeAndLatitude`](#1-fetchlongitudeandlatitude)
  - [`fetchWeatherData`](#2-fetchweatherdata)
  - [`fetchUniversities`](#3-fetchuniversities)
  - [`fetchAverageUniversityWeather`](#4-fetchaverageuniversityweather)
  - [`fetchUMassWeather`](#5-fetchumassweather)
  - [`fetchUCalWeather`](#6-fetchucalweather)
  - [`writeToJSONFile`](#7-writetojsonfile)
  - [`readFromJSONFile`](#8-readfromjsonfile)
- [Testing](#testing)

## Description

During this project, you will work as a group to complete an application that collects weather data for universities. You will query various web interfaces to collect information that will be either passed along as arguments to other interfaces or analyzed on its own.

This assignment shifts some of the focus from implementation towards collaboration. Please try to make the most out of this assignment. Do your assigned tasks (no more - no less), work amicably with your group (meet in-person and talk with them), and learn from this experience.

Between three people, and the time you are given, everyone should be able to do their part. **No one should have to pick up the slack of other group members.**

## Learning Objectives

Throughout this assignment, students will learn:

- How to collaborate with other programmers on a single project
- How to combine different third-party web services into a single asynchronous application
- How to chain and create `Promise` objects
- How to declare and interact with `URL` and `URLSearchParam` instances
- How to input and output to files using an asynchronous interfaces

## Student Expectations

Students may be graded on:

- How they collaborate with their team
- Their ability to complete the [programming tasks](#programming-tasks) documented below
- How they design unit-tests for all relevant functions and methods
  - See the [testing section](#testing) for how asynchronous code is tested

## Getting Started

### URLs and Parameters

Source: [MDN - What is a URL?](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/What_is_a_URL)

A Uniform Resource Locater (URL) is an address for a unique resource on the web. It is what your browser uses to retrieve documents, webpages, JavaScript code, images, and other media and supporting files. Each valid URL first tells your browser where the machine processing the request (the web server) lives. The rest of the URL is used by that web server to service the request and give back the corresponding resource.

Here are some examples of URLs:

```text
https://www.google.com/
https://www.google.com/maps
https://www.google.com/search?q=how+to+exit+vim
```

URLs have a specific structure, which tell both the browser, and the eventual web server, what the request means.

![URL](./url.png)

- **The scheme** documents the protocol the network request should use
  - The web uses `https` or `http`
- **The authority** documents where server that will process our request lives
  - Consists of the domain name and the port
    - The domain maps to a number (called the IP address) that is used to find the web server on the internet
    - The port is a wellknown number that describes where to talk to the web server once you reach the machine
      - Port 80 for http and 443 for https
- **The path** describes which resource we want to retrieve
  - When the web server first gets the request it will use the path to find the resource we are requesting
- **The parameters** describe how we want to query or provide input for that resource
  - The ask of the URL
  - What specifically is being search for?
  - > `?key1=value1&key2=value2` are extra parameters provided to the Web server. Those parameters are a list of key/value pairs separated with the & symbol. The Web server can use those parameters to do extra stuff before returning the resource. Each Web server has its own rules regarding parameters, and the only reliable way to know if a specific Web server is handling parameters is by asking the Web server owner.
- **The anchor** (irrelevant to this project) will tell the browser where specifically to scroll down to on the page

Looking more closely, at the URLs above:

- `https://www.google.com/` is a URL requesting the resource `/` at `www.google.com`
- `https://www.google.com/maps` is a URL requesting the resource `/maps` at `www.google.com`
- `https://www.google.com/search?q=how+to+exit+vim` is a URL requesting the resource `/search` at `www.google.com` providing a parameter `q` (short for query) with a value `how+to+exit+vim`

If you notice, the value of the `q` parameter looks a little weird. There are some characters that cannot be part of a URL (for example, a space) and some that are reserved for a specific purpose (like `&` separating parameters). To support passing these characters to parameters, strings first need to be put into a format that can be recognized as a URL. This is called [percent encoding](https://en.wikipedia.org/wiki/Percent-encoding). Luckily, there is a class in the Node.js standard library to handle all of that for you.

During this homework, you will construct URLs with specific parameters using the `URL` class in the Node.js standard library. As an example, if I wanted to make a function that constructs a Google search URL from a given query, I would write:

```js
import { URL } from "node:url"; // Import the URL class from the url library

function makeSearchURL(query) {
  // Construct a new URL object using the resource URL
  const searchURL = new URL("https://www.google.com/search");

  // Access the searchParams field of the constructed url
  // The field holds an instance of the URLSearchParams
  // Add a new "q" parameter with the value of the functions input
  searchURL.searchParams.append("q", query);

  return searchURL.toString(); // Return the resulting complete URL
}

makeSearchURL("vim tutorial youtube");
// -> https://www.google.com/search?q=vim+tutorial+youtube
makeSearchURL("2022 election results");
// -> https://www.google.com/search?q=2022+election+results
makeSearchURL("How to write the & symbol?");
// -> https://www.google.com/?q=How+to+write+the+%26+symbol%3F
makeSearchURL("你好");
// -> https://www.google.com/search?q=%E4%BD%A0%E5%A5%BD
```

More documentation, and examples, for the `URL` and `URLSearchParams` class can be found in the [Node.js standard library documentation](https://nodejs.org/dist/latest-v18.x/docs/api/url.html).

### Third-party APIs

Source: [MDN - Introduction to web APIs](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Introduction)

An Application Programming Interface (**API**) is the interface exposed by an application for other pieces of software to interact with. Web APIs (APIs on the world wide web) are a popular mechanism for exposing information and providing functionality to websites or other programs. A lot of websites are just an interface for interacting with a series of web APIs. These interfaces allow developers to create complex programs without doing all the heavy lifting.

In this homework, you will be interacting with a few third-party web APIs that provide information about universities, longitude and latitude, and weather data. These web APIs have various URL parameters that provide different functionality.

These web APIs will return unformatted JSON results. It is recommended that you either use Firefox or install [this chrome extension](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) so the results become readable. As an example:

![Raw JSON](./raw-json.png)

Could look like this instead:

![Formatted JSON](./formatted-json.png)

You will be provided with URLs to various APIs and the parameters they accept. It is your job to research these APIs further, come up with examples, and understand their behavior.

### Fetching Resources

**Fetching** is the process of retrieving the content from a URL across the web. Before your search results are displayed, your browser first needs to fetch the contents of the page located at the URL.

As you might imagine, this process is done asynchronously. Your browser does not wait for a fetch request to return before it allows you to do anything. It will fetch the requested page, allow you to switch tabs or type in other queries, and **then** after the fetch resolves it will display the content.

You will be using the `fetch` function to fetch, then parse, JSON data for the APIs you query.

```js
import fetch from "node-fetch";

fetch("https://spire-api.melanson.dev/instructors/?search=marius") // fetch the /instructions resource with a "search" parameter
  .then((response) => response.json()) // parse the result to a json
  .then(
    (json) =>
      json.length > 0 // This API returns an array of objects
        ? Promise.resolve(json[0]) // Resolve with the first object if present
        : Promise.reject(new Error("No results found.")) // Reject if nothing is present
  )
  .then((data) => fetch(new URL("/sections", data.url).toString()) // Fetch the associated /sections recourse for an instructor page
  .then((res) => res.json()) // Parse the section results
  .then((json) => console.log(`Marius Minea has taught ${json.count} different sections at UMass!`) // Do something with the final result
  .catch((err) => console.log("Unable to retrieve location data: " + err)); // Handle any error that happened
  // chaining promises makes errors propagate downward
```

## File Overview

Each major function has its own individual file and corresponding testing file.

### `npm` Commands

- `npm start`: Run the `./src/main.js` file
- `npm test`: Run the series of `*.test.js` files
- `npm prettier:fix`: Run the command line tool to format your code

## Resources

- [MDN Web Docs: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  - Promise syntax, description, examples, and specification
- [MDN Web Docs: Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
  - What are promises, how are they used, what are some common patterns when using them?
- [MDN Web Docs: How to use promises](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
  - Descriptions and examples of promises as they relate to web programming

## Programming Tasks

### 1. `fetchLongitudeAndLatitude`

**This function should be done individually by a single group member.**

Write a function, inside of `fetchLongitudeAndLatitude.js`, with the following type signature:

```ts
fetchLongitudeAndLatitude(query: string): Promise<{ lon: number, lat: number }>
```

This function should take in a query string and return a `Promise` that fulfils with an object. The object should have a field `lon` and a field `lat` - corresponding to the longitude and latitude result of the query. If there are multiple results for a query, pick the first one. If there are no results for a location (the result array is empty), then the promise should reject with an error identical to the one below:

```js
new Error("No results found for query.");
```

Use the following API to <https://geocode.maps.co/search?q=query> retrieve your results. The base URL should be "https://geocode.maps.co/search" and there should be one URL search parameter "q. This API returns an array of objects containing a `lon` and `lat` field.

See the [getting started section on queries](#urls-and-parameters) if you are confused. Use the `Number` function to convert to a number if needed.

### 2. `fetchWeatherData`

**This function should be done individually by a single group member.**

Write a function, inside of `fetchCurrentWeather.js`, with the following type signature:

```ts
fetchCurrentWeather(longitude: number, latitude: number): Promise<{ time: string[], temperature_2m: number[] }>
```

This function should take in a longitude and latitude and return a `Promise` that fulfils with an object. The object should have two number arrays called `time` and `temperature_2m`. The `time` field should be an array of times and the `temperature_2m` should be an array of corresponding temperature measurements.

Use the <https://api.open-meteo.com/v1/forecast> API to retrieve your result. It has `latitude` and `longitude` parameters. You should set the `hourly` parameter to `temperature_2m`, and the `temperature_unit` parameter to `fahrenheit`.

### 3. `fetchUniversities`

**This function should be done individually by a single group member.**

Write a function, inside of `fetchUniversities.js`, with the following type signature:

```ts
fetchUniversities(query: string): Promise<string[]>
```

This function should take in a query string and return a `Promise` that fulfils with an array of university names.

Use the <http://universities.hipolabs.com/search> API to retrieve your result. It has a `name` parameter to search for a University of a given name.

### 4. `fetchAverageUniversityWeather`

**This function should be done as a group, after each member has completed their individual tasks.**

Write a function with, inside of `universityWeather.js`, the following type signature:

```ts
fetchUniversityWeather(universityQuery: string): Promise<{ [key: string]: number }>
```

This function should take in a query string and return a `Promise` that fulfils with an object that contains the total average and individual average temperatures of all universities in the given `universityQuery` string. The total average should be in a field called `totalAverage` and the individual averages should use the name of the university as a key.

As an example, if there were three universities found by the query, then the object might look something like this:

```js
{
  totalAverage: 50,
  "University One": 60,
  "University Two": 40,
  "University Three": 50
}
```

### 5. `fetchUMassWeather`

**This function should be done as a group, after each completing task 4.**

Write a function, inside of `universityWeather.js`, with the following type signature:

```ts
fetchUMassWeather(): Promise<{ [key: string]: number }>
```

This function should find the average temperature of all universities in the "University of Massachusetts" system. Use the function from task 4 to compute your result.

### 6. `fetchUCalWeather`

**This function should be done as a group, after each completing task 4.**

Write a function, inside of `universityWeather.js`, with the following type signature:

```ts
fetchUCalWeather(): Promise<{ [key: string]: number }>
```

This function should find the average temperature of all universities in the "University of California" system. Use the function from task 4 to compute your result.

### 7. `writeToJSONFile`

**This function should be researched, then completed as a group.**

Write a function, inside of `fileUtility.js`, with the following type signature:

```ts
writeToJSONFile(path: string, data: object | object[]): Promise<void>
```

This function should take in a file path (`path`) and some data (`data`), and return a `Promise` that fulfils when the JSON representation of `data` is written to a file located at `path`. Use `writeFile` from the `fs/promises` library.

- [Documentation on `JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
- [Documentation on `writeFile` in the `fs/promises` library](https://nodejs.org/docs/latest-v17.x/api/fs.html#fspromisesreadfilepath-options).

### 8. `readFromJSONFile`

**This function should be researched, then completed as a group.**

Write a function, inside of `fileUtility.js`, with the following type signature:

```ts
readFromJSONFile(path: string): Promise<object | object[]>
```

This function should take in a path to a file (assumed to be JSON data), and return a `Promise` that fulfils with the parsed contents of the file. Use `readFile` from the `fs/promises` library.

- [Documentation on `JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).
- [Documentation on `readFile` in the `fs/promises` library](https://nodejs.org/docs/latest-v17.x/api/fs.html#fspromisesreadfilepath-options).

### 9. Working Example

**This task should be completed as a group.**

With the functions you have written above, write a small program (inside of `main.js`) that computes an interesting statistic about the weather or universities. The requirements of the program are:

- It must use at least three different functions written in steps 1-8
- The result of the program must be output somehow (either in the console or into a file)
  - If you choose a file I/O function, it counts towards the above requirement
- The program must be documented with what it calculates exactly
- The program must produce a correct result according to its documentation

Pick something interesting and try to have fun with it. The grading for this task will probably be lenient. As long as you meet the requirements stated above, you should receive full credit.

## Testing

Testing asynchronous code is a little different from testing synchronous code. One way or another, the testing framework needs to know that there is pending work to be done. **We tell the testing framework we are still "doing" work by returning a `Promise` in the test function rather than returning nothing**.

As an example, one of the given tests returns a `Promise` that has a handler that does the assertions.

```js
test("fetchLongitudeAndLatitude follows type specification", () => {
  return fetchLongitudeAndLatitude("University of Massachusetts Amherst").then(
    (result) => {
      assert("lon" in result); // Assert the "lon" field is present
      assert("lat" in result); // Assert the "lat" field is present
      assert(Object.keys(result).length === 2); // Assert there are only two keys in the object

      assert(typeof result.lon === "number"); // Assert that the lon value is a number
      assert(typeof result.lat === "number"); // Assert that the lat value is a number
    }
  );
});
```

Your tests should follow this similar pattern (`return foo().then(result => {/* assertions */ })`). Alternatively, you could use `async`/`await` syntax.

```js
test("fetchLongitudeAndLatitude follows type specification", async () => {
  const result = await fetchLongitudeAndLatitude(
    "University  of Massachusetts Amherst"
  );

  assert(typeof result === "object"); // Assert the result is an object
  assert("lon" in result); // Assert the "lon" field is present
  assert("lat" in result); // Assert the "lat" field is present
  assert(Object.keys(result).length === 2); // Assert there are only two keys in the object

  assert(typeof result.lon === "number"); // Assert that the lon value is a number
  assert(typeof result.lat === "number"); // Assert that the lat value is a number
});
```

Use what works best for you and your group members.

## Submitting

If you see this comment, then the autograder has not been published. Please be patient.

Only a single member in your group needs to submit. After submitting, that group member should click the `Add Group Members` button on the bottom right of your screen to create a group submission. After adding your group members, Gradescope will recognize that the other members have submitted the assignment. **Do not forget to include them in the final submission.**

- Run `npm run prettier:fix`
- Login to Gradescope
- Open the assignment submission popup
  - Click the assignment
- Open your file explorer and navigate to the folder of the project
  - This is the folder that immediately contains: `node_modules`, `src/`, `package.json`, `package-lock.json`
- Drag and drop the `src/` folder into the submission box
- Click upload

Your submission window should look like the following. **It should not contain any more or any less files.**

![Submission](./submission.png)
