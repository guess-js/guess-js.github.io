---
path: "/docs/next"
title: "Using Guess.js with Next.js"
---

[Next.js](https://nextjs.org) is a lightweight library for creating web applications. In this guide, we'll show how you can use Guess.js to **predictively prefetch** pages in your Next.js apps.

<div style="background-color: #e7f4ff; border-radius: 5px; padding: 20px; margin-bottom: 20px;">
You can find the source code for the application on <a href="https://github.com/mgechev/guess-next">GitHub</a>.
</div>

### Initializing the Application

First, create a directory called `guess-next` and a file `package.json`:

```bash
mkdir guess-next && cd guess-next && touch package.json
```

Inside `package.json` add the following content:

```json
{
  "name": "guess-next",
  "scripts": {
    "start": "next",
    "build": "next build",
    "export": "npm run build && next export -o guess"
  },
  "dependencies": {
    "next": "^6.1.1",
    "react": "^16.0.0",
    "react-dom": "^16.0.0",
    "guess-webpack": "^0.1.6"
  }
}
```

In the snippet above we declare metadata for a new Node.js project called `guess-next` and set its dependencies. We also add two scripts:

- `start` - starts a development server with live reloading
- `build` - builds our application using `next` from `node_modules/.bin/next`
- `export` - running `npm run export` will first build our application and after that export its static files to a directory called `guess`

As next step run `npm i` to install the project's dependencies.

### Application Layout

The application layout defines the structure of our application. In our example, we'll create a layout which has a header and an element where we'll render the currently selected page. In the `guess-next` directory, create a folder called `components` and add a file called `layout.js`:

```bash
mkdir components && cd components && touch layout.js
```

Inside `layout.js` add the following content:

```javascript
import { withRouter } from 'next/router';

import Link from 'next/link';
import Head from 'next/head';

const layout = ({ router, children, title = '🔮 Next.js + Guess.js' }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{' '}
          <Link href="/example">
            <a>Example</a>
          </Link>{' '}
          <Link href="/about">
            <a>About</a>
          </Link>
        </nav>
      </header>
      <div className="content">{children}</div>
    </div>
  );
};

export default withRouter(layout);
```

Inside of the component above, we create the navigation of the application. We create three links: `/`, `/examples`, and `/about`. After that, we add a `div` class name `content`. Inside of this element we render the children elements which are passed to the layout component. For example:

```javascript
<layout>
  <span>Hello, Guess.js!</span>
</layout>
```

The snippet above will render the `span` element with content "Hello, Guess.js!" inside of the `.content` element of the layout component.

### Creating Pages

Now in `guess-next` create a directory called `pages` and add the following files:

```text
pages/
├── about.js
├── example.js
├── index.js
└── media.js
```

As content of all of the files set the following JavaScript:

```javascript
import * as React from 'react';
import Layout from '../components/layout';

export default () => (
  <Layout>
    [PAGE_NAME]
  </Layout>
);
```

In the snippet above, we import the `Layout` component and as its content we set the string `[PAGE_NAME]`. Remember that this content will be rendered inside of the `div.content` element of the `Layout` component. Replace `[PAGE_NAME]` with the name of the corresponding page. For example, in `media.js` replace `[PAGE_NAME]` with `Media`:

```javascript
// media.js
import * as React from 'react';
import Layout from '../components/layout';

export default () => (
  <Layout>
    Media
  </Layout>
);
```

Inside of `about.js`, also add a `Link` to the `media` page:

```javascript
import * as React from 'react';
import Layout from '../components/layout';
import Link from 'next/link';

export default () => (
  <Layout>
    About
    <br />
    You can find the{' '}
    <Link href="/media">
      <a>media page here</a>
    </Link>
  </Layout>
);
```

At this stage, when you run `npm start` inside of the `guess-next` directory and you open <a href="http://localhost:3000">http://localhost:3000</a>, your application should look like this:

<img src="/images/next.gif" alt="Next.js application" style="display: block; max-width: 450px; margin: auto; margin-bottom: 20px;">

### Configuring Next.js

Now let us introduce the `GuessPlugin` plugin to the webpack configuration of our Next.js application!

Create a file called `next.config.js` in `guess-next` with the following content:

```javascript
const { GuessPlugin } = require('guess-webpack');

module.exports = {
  webpack: function(config, { isServer }) {
    if (isServer) return config;
    config.plugins.push(
      new GuessPlugin({
        reportProvider() {
          return Promise.resolve(JSON.parse(require('fs').readFileSync('./routes.json')));
        }
      })
    );
    return config;
  }
};
```

In the snippet above, we first import the `GuessPlugin` from `guess-webpack`. After that, we export an object literal with a property `webpack`. This is the hook which lets us alter the webpack configuration of Next.js.

The function which we set as the value of the `webpack` property accepts two arguments:

- `config` - the webpack configuration of our application that we're going to alter
- Object which contains metadata for the current build. Here we can access a flag called `isServer` which indicates if the current webpack invocation is for the build of the server or the client

Inside of the `webpack` function we check if this build is part of the server-side rendering that Next.js performs. In this case, we just want to return because we don't want Guess.js to perform any prefetching at this phase. Otherwise, we push the `GuessPlugin` in the end of the webpack configuration.

Notice the argument we pass to the `GuessPlugin` - an object literal with a single property called `reportProvider`. Guess.js accepts a report provider which returns the analytics data for the application. In this case, we provide the report from the disk.

Create a file called `routes.json`, in the same directory as `next.config.js`, and add the following content:

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

This file specifies how many times the user has visited given page from another. For example, if we look at the first property of the outer-most object, we can see that from `/`, there were `80` sessions in which users have visited `/example` and `20` sessions in which users have visited `/about`.

**Based on the content of this file, Guess.js is going to build a model for predictive prefetching.**

<div style="background-color: #e7f4ff; border-radius: 5px; padding: 20px; margin-bottom: 20px;">
Alternatively, if you're using Google Analytics, instead of providing a <code>reportProvider</code>, you can set the <code>GA</code> property with value your Google Analytics View ID. In this case, Guess.js will fetch data from your Google Analytics account and build the report automatically. For the purpose, you'll have to provide a read-only access to your view.
</div>

### Predictive Prefetching

We're almost at the finish line! 🏁 Now we're going to perform the actual predictive prefetching with the help of the Next.js' router.

Let's introduce a small snippet of code as part of our component in `layout.js`:

```javascript
import { withRouter } from 'next/router';
import { guess } from 'guess-webpack/api';

import Link from 'next/link';
import Head from 'next/head';

const layout = ({ router, children, title = '🔮 Next.js + Guess.js' }) => {

  if (typeof window !== 'undefined')
    Object.keys(guess()).forEach(p => router.prefetch(p));

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{' '}
          <Link href="/example">
            <a>Example</a>
          </Link>{' '}
          <Link href="/about">
            <a>About</a>
          </Link>
        </nav>
      </header>
      <div className="content">{children}</div>
    </div>
  );
};

export default withRouter(layout);
```

The two changes we did are:

1. We imported `guess` from the module `guess-webpack/api`
2. We're not performing prefetching based on the predictions of Guess.js

Let us take a look at the second point because there's a lot going on there. First, we check if the value of `window` is not `undefined`. We do this, to make sure that we're running our application in the browser. We do not want to perform prefetching during server-side rendering. After that, we invoke `guess()`. This invocation will return an object literal of the form:

```json
{
  "/": 0.3,
  "/about": 0.7
}
```

The semantics of this object is:

- There's `0.3` probability the user to visit `/` from the current page
- There's `0.7` probability the user to visit `/about` from the current page

Based on this knowledge, we prefetch the bundles associated with the corresponding pages using `router.prefetch`.

Keep in mind that this piece of logic will be invoked every time when the user performs a navigation but thanks to `router.prefetch`, we're not going to download the same bundle twice!

### Conclusion

In this guide we saw how we can integrate Guess.js with Next.js.

First, we developed a simple Next.js application with four pages. After that, we altered the webpack configuration of our application by using `next.config.js` and introduced the `GuessPlugin` as part of the build phase.

Finally, inside of the layout component, we added a small snippet with the prefetching logic, where we use the `guess()` function from the `guess-webpack/api` package to predict which pages are likely to be visited next from the current page. Using `router.prefetch` we prefetched the bundle corresponding with the predicted pages by Guess.js.
