import { fetchUniversities } from "./fetchUniversities";

test("fetchUniversities follows type specification", () => {
  return fetchUniversities("University of Massachusetts Amherst").then(
    (result) => {
      assert(Array.isArray(result));
      assert(result.every((x) => typeof x === "string"));
    }
  );
});
