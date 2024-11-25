# Brand Colors Collection

This repository is dedicated to collecting the color data of brands and products around the world and offering them as a free static API here.

- API: https://api.brandcolor.dev/
- Web: http://pickcoloronline.com/brands

# API

- Get all: https://api.brandcolor.dev/brands.json
- Get brand: https://api.brandcolor.dev/brand/:slug.json Example: https://api.brandcolor.dev/brands/airbnb.json

# How to Contribute?

1. Fork the repository and create or update a `.json` file in the `brands` directory.
2. Add or modify the colors following this basic schema:

```json
{
  "title": "Airbnb",
  "colors": ["FF5A5F", "FF00FE"],
  "brandUrl": "https://www.airbnb.com/",
  "sourceUrl": "https://airbnb.design/building-a-visual-language/"
}
```

3. Create a PR with your new colors.
