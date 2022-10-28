# Homework 6 - Part A

## Overview

During this project, you will implement a _fluent filter_ for a list of Pokemon. This filter will accept various conditions, then apply those conditions once the filtered list of Pokemon is requested. The filtering conditions may be on fields that are not readily available. These fields will first need to be _fetched_, before we can apply conditions on them.

## Learning Objectives

After completing this project, students should be able to:

- Program asynchronous functions using the `Promise` interface
- Understand the basics of fetching information across the web

## Student Expectations

Students will be graded on:

- Their ability to complete the programming tasks documented below
- How they design unit-tests for all relevant functions and methods

## Getting Started

### APIs and Fetching

An Application Programming Interface (**API**) is the interface exposed by an application for other pieces of software to interact with. Web APIs (APIs on the internet) are a popular mechanism for exposing information and providing functionality to websites or other programs. Most modern websites are merely a graphical interface for interacting with a web API.

**Fetching** is the process of retrieving the content from a URL across the internet. Before your search results are displayed, your browser first needs to fetch the contents of the page located at the URL <https://www.google.com/search?q=baking+recipes>.

As you might imagine, this process is asynchronous. Your browser does not wait for a fetch request to return before allows you to do anything. It will fetch the requested page, allow you to switch tabs or type in other queries, and **then** after the fetch resolves, it will display the information on your screen.

In this homework, you will be interacting with a Web API that provides information about Pokemon.

Open up the following URL (<https://pokeapi.co/api/v2/pokemon?limit=-1>) in your browser. You will notice a long JSON string will be displayed. A formatted version of the results is shown below:

```js
{
  count: 1154, // The amonut of entries
  next: null, // Ignore
  previous: null, // Ignore
  results: [ // An array of entries
    { // A Pokemon entry
      "name": "bulbasaur", // The name of a pokemon
      "url": "https://pokeapi.co/api/v2/pokemon/1/" // The URL for details of this pokemon
    },
    {
      "name": "ivysaur",
      "url": "https://pokeapi.co/api/v2/pokemon/2/"
    }
    {
      "name": "venusaur",
      "url": "https://pokeapi.co/api/v2/pokemon/3/"
    },
    {
      "name": "charmander",
      "url": "https://pokeapi.co/api/v2/pokemon/4/"
    },
    {
      "name": "charmeleon",
      "url": "https://pokeapi.co/api/v2/pokemon/5/"
    },
    {
      "name": "charizard",
      "url": "https://pokeapi.co/api/v2/pokemon/6/"
    },
    // Hundreds of other Pokemon entries...
  ]
}
```

We have provided two functions for you to use.

`fetchPokemonList` will fetch the URL above, then convert the JSON string into a JavaScript object, then resolve with the

- Explain:

  - Fluent design
  - JSON
  - APIs
  - Fetching

- Explain:
  - "You will be creating a series of asynchronous utility functions and a fluent filter for a pokemon api"
  - Provided interface `fetchPokemonList` & `fetchPokemonDetail`
  - You are not allowed to use any loops inside of the `FluentPokemonFilter`
  - Example usage:

```js
const pokemonFilter = new FluentPokemonFilter()
  .hasType("grass")
  .hasStatGreaterThan("health", 15)
  .hasStatLessThan("defense", 50)
  .inGeneration("generation-i")
  .encounteredIn("pallet-town-area"); // Provide conditions on the filter
```

```js
pokemonFilter
  .fetch() // Fetch all data that matches the conditions
  .then((list) => console.log(list))
  .catch((rej) => console.error(rej));
```

## Resources

- [MDN Web Docs: Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  - Promise syntax, description, examples, and specification
- [MDN Web Docs: Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
  - What are promises, how are they used, what are some common patterns when using them?
- [MDN Web Docs: How to use promises](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
  - Descriptions and examples of promises as they relate to web programming

## Programming Tasks

1. Implement the following function in `asyncUtil.js`

```js
// mapArrayAsync<T, U>(a: T[], f: T => Promise<U>): Promise<U[]>
export function mapArrayAsync(a, f) {
  // TODO
}
```

This function will take in a generic array, `a`, and an asynchronous function `f`. It will create a new array populated with the resolutions of the calls to `f` on each element of `a`. The promise should reject if, at any point, `f` rejects.

It is similar to the [standard map method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), but the transforming function is asynchronous.

Use the [`Promise.all` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all).

Use higher-order functions where applicable.

2. Implement the following function in `asyncUtil.js`

```js
// filterArrayAsync<T>(a: T[], f: (x: T) => Promise<boolean>): Promise<T[]>
export function filterArrayAsync(a, f) {
  // TODO
}
```

This function will take in a generic array, `a`, and an asynchronous function `f`. Creates a new array populated with the elements of `a` that resolved to `true` when passed to `f`. The promise should reject, if at any point, `f` rejects.

It is similar to the [standard filter method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), but the condition is asynchronous.

Use `mapArrayAsync`.

**The following tasks below are methods of the `FluentPokemonFilter` class. You are to implement them using higher-order functions (including the ones written in steps 1 and 2). No loops are allowed.**

These methods should push functions into various instance variables. These instance variable should then be used in `fetch` to determine if an entry is kept in the output. You will need to implement the constructor to initialize these variables.

3. Implement `hasStatGreaterThan`, `hasStatLessThan`, `hasType` (sync filters)

4. Implement `inGeneration`, `encounteredIn` (async filters)

5. Implement `fetch`

# OLD NOTES FOR REFERENCE

### Learning Objectives

- fluent design
- async programming

### Student Expectations

- complete the coding tasks
- unit testing???
  - how do we expect students to write unit test for this? (properties, mostly?)
    - subset of expected set will still have all properties (how do they know they are not missing something)
    - lots of data
  - option of no private autograder tests???

## Getting Started

- use firefox or [this chrome extension](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) to view the [application program interface (api)](https://pokeapi.co/api/v2/pokemon)
  - gain a general sense of what data is available
  - information about pokemon, their abilities, stats, moves, descriptions, media appearances, and photos
- the default route (<https://pokeapi.co/api/v2/pokemon>) is paginated (explain what that means)
- we need to write a program that will procedurally filter data on each page
  - these filtering functions will themselves be asynchronous, as they might need to fetch the information to filter on

## Programming Tasks

- utility code for them to use

  - guides them in the direction of writing cleaner, better abstracted code
  - see example below

- a few basic single link filters (default route -> info page)

  - all pokemon with more/less/equal weight/speed/health/attack/defense stats
  - all pokemon with more/less/equal abilities/forms/game_indices (versions of the game they have been in)

- some more nuanced filters (default route -> info page -> relationship page)
  - all pokemon that can be found in location with name X
    - fetch pokemon -> fetch location_area_encounters -> array.find(x.location_area.name === X)
  - all pokemon that can be found in a location that has more/less/equal chance to encounter
    - fetch pokemon -> fetch location_area_encounters -> array.some(x.encounter_details.some(y.chance ?? wanted chance))
  - all pokemon that share an ability with a pokemon named X
    - fetch pokemon -> fetch abilities (sometimes numerous) -> ability.pokemon.find(pokemon.pokemon.name === X)

## Note

- group project
- async programming using promises
- filtering pokemon data
- fetching information (is async) & not all fields we want to filter on are on a single page
- navigating across the website, fetching then filtering data across numerous pages, then producing a result
- multi-part assignment

  - lots of time to work, need to make sure they are completing various checkpoints

- group size?? 3 students.
- how are they collaborating??

  - replit
  - possible git/github part part

- what code is provided?
  - anything that does handles network requests
    - fetchPage(url)
  - code to navigate across pages (see main.js)
    - need to change to procedural fetching rather than all at once
  - some types so they can see how data is structured

```js
const pokemonFilter = new FluentPokemonFilter()
  .hasWeightLessThan(50) // Pushes a sync filter function to an instance variable
  .foundInArea("pallet-town-area"); // Pushes a sync filter function to a different instance variable

const pokemonResult = pokemonFilter.nextPage(); // given??
// return async fetch to default route
// .then(pokemon => {
//   return asyncFilter(pokemon, (p) => {         // IDEA: have them implement an async filter for an array
//     looks at all stored filters
//     do sync filters
//     if all sync filters pass
//       if no filters on cross-rel. fields
//         ret Promise.resolve(true)
//       else
//         fetch related info
//           .then(info => Promise.resolve(cross-relationship-filters.every(info)))
//     else
//        Promise.resolve(false)
//    });
// });
```
