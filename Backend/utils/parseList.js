// Normalises list input from JSON bodies or multipart forms into a clean string array.
// Accepts an array, a JSON-encoded array string, or a comma-separated string.
export const parseList = (value) => {
  if (value === undefined || value === null) return [];

  let list = value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("[")) {
      try {
        list = JSON.parse(trimmed);
      } catch {
        list = trimmed.split(",");
      }
    } else {
      list = trimmed.split(",");
    }
  }

  if (!Array.isArray(list)) return [];

  return [...new Set(list.map((item) => String(item).trim()).filter(Boolean))];
};
