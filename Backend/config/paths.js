import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Absolute path to Backend/uploads, independent of the process working directory
export const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
