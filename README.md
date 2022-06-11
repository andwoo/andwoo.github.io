# Notes
## Commands
- `jekyll build` - Builds the site and outputs a static site to a directory called _site.
- `jekyll serve` - Does jekyll build and runs it on a local web server at http://localhost:4000, rebuilding the site any time you make a change.

## Deployment
https://stevenwestmoreland.com/2021/01/using-tailwind-css-with-jekyll.html

When building for production, always set JEKYLL_ENV=production and NODE_ENV=production on the command line. When these variables are set to production, unused Tailwind styles are purged and the output is processed with cssnano.
```
JEKYLL_ENV=production NODE_ENV=production bundle exec jekyll build
```