import { fetchLongitudeAndLatitude } from "./thing";

test("fetchLongitudeAndLatitude follows type specification", () => {
  return fetchLongitudeAndLatitude("University of Massachusetts Amherst").then(
    (result) => {
      assert(typeof result === "object"); //  Assert the result is an object
      assert("lon" in result); // Assert the "lon" field is present
      assert("lat" in result); // Assert the "lat" field is present
      assert(Object.keys(result).length === 2); // Assert there are only two keys in the object

      assert(typeof result.lon === "number"); // Assert that the lon value is a number
      assert(typeof result.lat === "number"); // Assert that the lat value is a number
    }
  );
});
