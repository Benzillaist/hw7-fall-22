import { URL } from "node:url"; // Import the URL class from the url library

function makeSearchURL(query) {
  const searchURL = new URL("https://www.google.com/search"); // Construct a new URL object using the resource URL

  // Access the searchParams field of the constructed url
  // The field holds an instance of the URLSearchParams
  // Set the "q" parameter to the input
  searchURL.searchParams.set("q", query);

  return searchURL.toString(); // Return the resulting complete URL
}

console.log(makeSearchURL("vim tutorial youtube")); // https://www.google.com/search?q=vim+tutorial+youtube
console.log(makeSearchURL("2022 election results")); // https://www.google.com/search?q=2022+election+results
console.log(makeSearchURL("how to write the & symbol")); // https://www.google.com/search?q=how+to+write+the+%26+symbol
console.log(makeSearchURL("你好")); // https://www.google.com/search?q=%E4%BD%A0%E5%A5%BD
