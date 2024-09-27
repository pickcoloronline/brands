import { title } from "process";
import { config } from "./config";
import { getBrand, getBrands } from "./services/getBrands";
import { createDir, writeFile } from "./services/writeFiles";

const init = async () => {
  const brands = await getBrands();
  console.log(`${brands.length} brands found.`);

  createDir(config.outputFolderPath + "/" + "brands");

  const brandExcerpt: any = {};

  for (const brand of brands) {
    const brandData = await getBrand(brand);

    writeFile(
      config.outputFolderPath + "/" + "brands" + "/" + brand + ".json",
      JSON.stringify(brandData)
    );

    brandExcerpt[brand] = {
      title: brandData.title,
    };
  }

  console.log("Writing brands.json");
  writeFile(
    config.outputFolderPath + "/" + "brands.json",
    JSON.stringify(brandExcerpt)
  );
};

init();
