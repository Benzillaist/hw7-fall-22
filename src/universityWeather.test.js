import { fetchUCalWeather } from "./universityWeather";

test("fetchUCalWeather follows type specification", () => {
  return fetchUCalWeather().then((result) => {
    test(typeof result === "object");
    test(Object.keys(result).every((x) => typeof x === "string"));
    test(Object.values(result).every((x) => typeof x === "number"));
  });
});

test("fetchUMassWeather follows type specification", () => {
  return fetchUCalWeather().then((result) => {
    test(typeof result === "object");
    test(Object.keys(result).every((x) => typeof x === "string"));
    test(Object.values(result).every((x) => typeof x === "number"));
  });
});
