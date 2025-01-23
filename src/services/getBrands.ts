import Joi from "joi";
import { promises as fs } from "fs";
import { execSync } from "child_process";
import { config } from "../config";
import path from "path";

const brandSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string()
    .required()
    .lowercase()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  colors: Joi.array()
    .items(
      Joi.string()
        .hex()
        .pattern(/^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/)
        .lowercase()
    )
    .min(1)
    .required(),
  brandUrl: Joi.string().uri().allow(null),
  sourceUrl: Joi.string().uri().allow(null),
});

/**
 * Returns the first (oldest) and last (newest) commit dates for a file using Git.
 * Both are returned as numeric timestamps (milliseconds since epoch).
 *
 * @param filePath Absolute or relative path to the file within a Git repository
 * @returns An object with `createdAt` and `updatedAt` timestamps in ms.
 */
function getGitTimestamps(filePath: string) {
  try {
    // Get all commit dates in descending order (newest first)
    const output = execSync(
      `git log --pretty=format:%ci -- "${filePath}"`,
      { encoding: "utf8" }
    );

    // Each line is one commit date in ISO-8601 format
    const lines = output.trim().split("\n").filter(Boolean);

    if (!lines.length) {
      // If no commits found for this file (not tracked by Git)
      return null;
    }

    // Newest commit date is the first line
    const newest = new Date(lines[0]).getTime();
    // Oldest commit date is the last line
    const oldest = new Date(lines[lines.length - 1]).getTime();

    return {
      createdAt: oldest,
      updatedAt: newest,
    };
  } catch (error) {
    console.error(`Error getting git timestamps for ${filePath}:`, error);
    return null;
  }
}

export const getBrands = async (): Promise<string[]> => {
  const files = await fs.readdir(config.inputFolderPath);
  return files
    .map((file) => path.basename(file, ".json"))
};

export const getBrand = async (slug: string): Promise<any> => {
  const filePath = path.join(config.inputFolderPath, `${slug}.json`);
  const data = await fs.readFile(filePath, { encoding: "utf8" });

  // Fallback: basic file stats (in case Git fails or the file is not tracked)
  const stats = await fs.stat(filePath);
  let createdAt = parseInt(String(stats.birthtimeMs));
  let updatedAt = parseInt(String(stats.mtimeMs));

  // Attempt to get timestamps via Git
  const gitTimes = getGitTimestamps(filePath);
  console.log({ gitTimes });
  if (gitTimes) {
    createdAt = gitTimes.createdAt;
    updatedAt = gitTimes.updatedAt;
  }

  const parsedData = JSON.parse(data);
  parsedData.slug = slug;

  const { error, value } = brandSchema.validate(parsedData, { convert: true });

  if (error) {
    console.error(
      `Error validating ${slug}: ${error.message}\nBrand ${slug} will be skipped.`
    );
    throw error;
  }

  return {
    ...value,
    createdAt,
    updatedAt,
  };
};
