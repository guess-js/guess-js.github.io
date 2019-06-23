---
path: "/docs/nuxt"
title: "Using Guess.js with Nuxt.js"
---

[Nuxt.js](https://github.com/nuxt/nuxt.js) is a [Vue.js](https://vuejs.org/) Meta Framework to create complex, fast & universal web applications quickly. In this guide, we'll show how to use Guess.js to **predictively prefetch** pages in your Nuxt.js apps.


<div style="background-color: #e7f4ff; border-radius: 5px; padding: 20px; margin-bottom: 20px;">
You can find the source code for the application on <a href="https://github.com/daliborgogic/guess-nuxt">GitHub</a>.
</div>

### Creating a Nuxt.js Application

Creating a Nuxt.js application from scratch is really easy, it only needs 1 file and 1 directory. Let's create an empty directory and `package.json` file to start working on the application:

```bash
$ mkdir guess-nuxt && cd guess-nuxt && npm init -y
```

Then we need to specify how to start `nuxt`:

```json
{
  "name": "guess-nuxt",
  "scripts": {
    "dev": "nuxt",
    "build": "nuxt build",
    "start": "nuxt start"
  }
}
```

- `dev` - will launch Nuxt.js via `npm run dev` at `http://localhost:3000`.
- `build` - will build your application with webpack and minify the JS & CSS (for production).
- `start` - will start the server in production mode (after running nuxt build).

Add `nuxt` to the project's as `dependencies` and `guess-webpack` as `devDependencies`:

```bash
$ npm i nuxt && npm i -D guess-webpack
```

### Application Layout

The application `layout` defines the structure of the application. In our example, we'll create a layout which has a `nav` and an element where we'll render the currently selected page. In the `guess-nuxt` directory, create a folder called `layouts` and add a file called `default.js`:

```bash
$ mkdir layouts && cd layouts && touch default.vue
```

Next, let’s update the `default.vue` file as well:

```html
<template>
  <div>
    <nav>
      <nuxt-link to="/" exact>Home</nuxt-link>
      <nuxt-link to="/example">Example</nuxt-link>
      <nuxt-link to="/about">About</nuxt-link>
    </nav>
    <nuxt/>
  </div>
</template>
```

In the `layout/default.vue` above, we create the navigation menu of the application. We create three links: `/`, `/examples`, and `/about`. After that, we add a `<nuxt/>` element. Inside of this element, we render the children elements which are passed to the `layout`.

### Creating Pages

Nuxt.js will transform every `*.vue` file inside the `pages` directory as a route for the application.

```
pages/
├── about.vue
├── example.vue
├── index.vue
└── media.vue
```

Let's create `pages`

```bash
$ mkdir pages && cd pages && touch about.vue example.vue index.vue media.vue
```

Inside of `pages/about.vue`, add a link to the `media` page:

```html
<template>
  <div>
    <h1>About</h1>
    <p>You can find the media page <nuxt-link to="/media">here</nuxt-link>.</p>
  </div>
</template>
```

In rest of `pages/*.vue` add some content:

```html
<template>
  <h1>[REPLACE_WITH_TITLE_PAGE]</h1>
</template>
```

At this stage, when you run `npm run dev` inside of the `guess-nuxt` directory and you open `http://localhost:3000`, your application should look like this:

<img src="/images/nuxt.gif" alt="Nuxt.js application" style="display: block; max-width: 450px; margin: auto; margin-bottom: 20px;">


### Configuring Nuxt.js

Now let us introduce the `GuessPlugin` plugin to the webpack configuration of our Nuxt.js application!

Create a file called `nuxt.config.js` in `guess-nuxt` with the content below. In [Nuxt 2.4.0](https://nuxtjs.org/guide/release-notes#smart-prefetching-), pages are automatically prefetched using [quicklink](https://github.com/GoogleChromeLabs/quicklink). To use Guess.js instead, you need to disable that feature by setting `router.prefetchLinks` to `false`.

```javascript
import { readFileSync } from 'fs'
import { GuessPlugin } from 'guess-webpack'

export default {
  build: {
    extend(config, ctx) {
      if (ctx.isClient) {
        config.plugins.push(
          new GuessPlugin({
            reportProvider() {
              return Promise.resolve(JSON.parse(readFileSync('./routes.json')))
            }
          })
        )
      }
    }
  },
  // Nuxt > v2.4.0
  router: {
    prefetchLinks: false
  }
}
```

Now create a file called `routes.json`, in the same directory as `nuxt.config.js`, and add the following content:

```json
{
  "/": {
    "/example": 80,
    "/about": 20
  },
  "/example": {
    "/": 20,
    "/media": 0,
    "/about": 80
  },
  "/about": {
    "/": 20,
    "/media": 80
  },
  "/media": {
    "/": 33,
    "/about": 33,
    "/example": 34
  }
}
```

This file specifies how many times the user has visited a given page from another. For example, if we look at the first property of the outermost object, we can see that from `/`, there were `80` sessions in which users have visited `/example` and `20` sessions in which users have visited `/about`.

> Based on the content of this file, Guess.js is going to build a model for predictive prefetching.

<div style="background-color: #e7f4ff; border-radius: 5px; padding: 20px; margin-bottom: 20px;">
Alternatively, if you're using Google Analytics, instead of providing a <code>reportProvider</code>, you can set the <code>GA</code> property with value your Google Analytics View ID. In this case, Guess.js will fetch data from your Google Analytics account and build the report automatically. For the purpose, you'll have to provide a read-only access to your view.
</div>

In this particular case there is slight changes in `nuxt.config.js`:

```javascript
import { readFileSync } from 'fs'
import { GuessPlugin } from 'guess-webpack'

const { GA } = process.env

export default {
  build: {
    extend(config, ctx) {
      if (ctx.isClient) {
        let guessOptions = {}
        if (GA) guessOptions.GA = GA
        else guessOptions.reportProvider = () => Promise.resolve(JSON.parse(readFileSync('./routes.json')))

        config.plugins.push(
          new GuessPlugin(guessOptions)
        )
      }
    }
  }
}
```

Alternatively, there is a [@nuxtjs/guess](https://github.com/daliborgogic/guess-module) module for Guess.js!

### Setup

- Add `@nuxtjs/guess` dependency to your project
- Add `@nuxtjs/guess` to modules section of `nuxt.config.js`
- If using Nuxt > 2.4.0, set `router.prefetchLinks` to `false` in `nuxt.config.js`

```json
{
  "modules": [
    [ "@nuxtjs/guess", { "GA": "XXXXXXX" }]
 ]
}
```

Options are given directly to `guess-webpack` [options](https://www.npmjs.com/package/guess-webpack#advanced-usage).

Nothing more to do, `@nuxtjs/guess` will automagically prefetch the routes depending of your Google Analytics stats sunglasses 😎

### Predictive Prefetching

Let's go back one step. We're at the finish line! 🏁 Now we're going to perform the actual predictive prefetching.
Let's introduce a small snippet of code as part of the Nuxt.js `plugin/guess.js`:

```javascript
import Vue from 'vue'
import { guess } from 'guess-webpack/api'

export default ({ app: { router } }) =>  {
  router.afterEach(to => {
    // Wait for page to be displayed
    Vue.nextTick(() => {
      let predictions = Object.keys(guess()).sort((a, b) => a.probability - b.probability)
      predictions.forEach(path => {
        router.getMatchedComponents(path).forEach(Component => {
          if (typeof Component === 'function') {
            try { Component() } catch (e) {}
          }
        })
      })
    })
  })
}
```

Next, register `plugin/guess.js` in `nuxt.config.js`:

```javascript
export default {
  plugins: [
    { src: '~/plugins/guess', ssr: false }
  ]
}
```

### Conclusion

In this guide, we saw how we could integrate Guess.js with Nuxt.js.
First, we developed a simple Nuxt.js application with four pages. After that, we altered the `webpack` configuration of our application by using `nuxt.config.js` and introduced the `GuessPlugin` as part of the build phase.

Finally, inside `guess.js` plugin, we added a small snippet with the predictions logic, where we use the `guess()` function from the `guess-webpack/api` package to predict which pages are likely to be visited next from the current page. Using `router` we prefetched the bundle corresponding with the predicted pages by `Guess.js`.
