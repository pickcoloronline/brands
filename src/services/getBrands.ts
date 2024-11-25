import Joi from "joi";
import { promises as fs } from "fs";
import { config } from "../config";
import path from "path";

const brandSchema = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required().lowercase(),
  colors: Joi.array()
    .items(Joi.string().hex().pattern(
      /^([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/
    ).lowercase())
    .min(1)
    .required(),
  brandUrl: Joi.string().uri().allow(null),
  sourceUrl: Joi.string().uri().allow(null),
});

export const getBrands = async (): Promise<string[]> => {
  const files = await fs.readdir(config.inputFolderPath);
  return files.map((file) => path.basename(file, ".json"));
};

export const getBrand = async (slug: string): Promise<any> => {
  const filePath = path.join(config.inputFolderPath, `${slug}.json`);
  const data = await fs.readFile(filePath, { encoding: "utf8" });
  const stats = await fs.stat(filePath)

  const parsedData = JSON.parse(data);
  parsedData.slug = slug;

  const { error, value } = brandSchema.validate(parsedData, { convert: true });

  const createdAt = parseInt(String(stats.birthtimeMs))
  const updatedAt = parseInt(String(stats.mtimeMs))

  if (error) {
    throw error;
  }
  return {
    ...value,
    createdAt,
    updatedAt
  };
};
