# Website of Guess.js

This repository contains the source code for [guessjs.com](https://guessjs.com).

## Usage

```bash
npm i -g gatsby
git clone git@github.com:guess-js/guessjs.com && cd guessjs.com
npm i
gatsby develop
```

## Adding a Guide

To add a guide, create a markdown file in the `content` directory. To add a link to the guide in the "Docs" page, edit `src/components/docs-layout/index.js` and add a new entry in the `renderSidebar` method.

## License

MIT
