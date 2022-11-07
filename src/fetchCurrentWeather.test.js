import { fetchCurrentWeather } from "./fetchCurrentWeather";

test("fetchCurrentWeather follows type specification", () => {
  return fetchCurrentWeather(42.36, -71.05).then((result) => {
    test(typeof result === "object");
    test("time" in result && Array.isArray(result.time));
    test("temperature_2m" in result && Array.isArray(result.temperature_2m));
  });
});
