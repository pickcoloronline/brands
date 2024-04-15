import { promises as fs } from "fs";
import path from "path";

export const createDir = async (dirPath: string): Promise<void> => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Directory created or already exists: ${dirPath}`);
  } catch (error) {
    console.error(`Error creating directory: ${error}`);
    throw error;
  }
};

export const writeFile = async (
  filePath: string,
  data: string
): Promise<void> => {
  const dirPath = path.dirname(filePath);

  // Ensure the directory exists
  await createDir(dirPath);

  try {
    await fs.writeFile(filePath, data, "utf8");
    console.log(`File written successfully to ${filePath}`);
  } catch (error) {
    console.error(`Error writing file: ${error}`);
    throw error;
  }
};
