---
path: "/docs/angular"
title: "Using Guess.js with Angular"
---

In this guide, we'll introduce **predictive prefetching** in an Angular application. Let us get started!

<div style="background-color: #e7f4ff; border-radius: 5px; padding: 20px; margin-bottom: 20px;">
You can find the source code for the application on <a href="https://github.com/mgechev/guess-angular">GitHub</a>.
</div>

### Bootstrapping the Application

To bootstrap the application we're going to use Angular CLI. Make sure you have the latest version installed:

```bash
npm i -g @angular/cli
ng --version
```

This guide uses Angular CLI 7.0.3.

After that run:

```bash
ng new guess-angular
```

Make sure that during initialization you add Angular routing:

```bash
ng new guess-angular
? Would you like to add Angular routing? Yes
? Which stylesheet format would you like to use? CSS
```

### Creating an Application

As next step, let us define a few routes! Inside the `app-routing.module.ts` add the following configuration:

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: './index/index.module#IndexModule'
  },
  {
    path: 'about',
    loadChildren: './about/about.module#AboutModule'
  },
  {
    path: 'example',
    loadChildren: './example/example.module#ExampleModule'
  },
  {
    path: 'media',
    loadChildren: './media/media.module#MediaModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

We declare four routes, all of which we load lazily. For each route, declare the corresponding module and a component. For example, for the `media` route, we should have `media.module.ts`, which looks like this:

```typescript
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MediaComponent } from './media.component';

@NgModule({
  declarations: [MediaComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MediaComponent
      }
    ])
  ]
})
export class MediaModule {}
```

And a `media.component.ts`:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-media',
  template: 'Media'
})
export class MediaComponent {}
```

When you're ready, your `src/app` directory structure should look like follows:

```text
.
├── about
│   ├── about.component.ts
│   └── about.module.ts
├── app-routing.module.ts
├── app.component.css
├── app.component.html
├── app.component.spec.ts
├── app.component.ts
├── app.module.ts
├── example
│   ├── example.component.ts
│   └── example.module.ts
├── index
│   ├── index.component.ts
│   └── index.module.ts
└── media
    ├── media.component.ts
    └── media.module.ts
```

In order to have a link to the `MediaModule`, set the template of the `AboutComponent` to:

```html
About <a routerLink="/media">Media</a>
```

Finally, update the `AppComponent`'s template to:

```html
<a routerLink="">Home</a>
<a routerLink="example">Example</a>
<a routerLink="about">About</a>

<br>

<router-outlet></router-outlet>
```

### Running the Application

Once you've defined all routes from above, start a development server:

```bash
ng serve
```

<img src="/website/images/angular-before.gif" alt="Angular application" style="display: block; max-width: 450px; margin: auto; margin-bottom: 20px;">

Notice that while navigating in the application, each time when the user visits a page the browser sends a request for the corresponding JavaScript bundle. We observe this behavior because we're using lazy-loading for each route. Lazy-loading is a compelling technique that allows us to drop the size of the initial bundle. On the other hand, lazy-loading may also introduce latency when changing the page, if we haven't downloaded the bundles associated with the target route.

### Predictive Prefetching

The introduced latency in the example above is negotiable because the bundles are tiny, but in a real-life application, the user would have to wait hundreds of milliseconds before the navigation completes. To address this issue, we can **use prefetching**. Prefetching allows us to fetch in advance resources which are likely to be needed shortly. For example, if we know that after being in the "Home" page the user is likely to visit "Example" we can download the JavaScript associated with "Example" while the user is still in the "Home" page.

Guess.js allows us to use prefetching by considering the user's navigational patterns extracted from an analytics report. For example, Guess.js can consume data from Google Analytics, build a machine learning model, and, at runtime, prefetch the resources which are likely to be needed next!

For simplicity in this guide, we're going to extract the report from a file, instead of using Google Analytics. In the root of your application, create a file called `routes.json` with the following content:

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

Now let us extend the build of Angular CLI so we can use the Guess.js' webpack plugin!

### Extending Angular CLI

To extend Angular CLI, we're going to use `@angular-builders/custom-webpack` as explained in [this](https://codeburst.io/customizing-angular-cli-6-build-an-alternative-to-ng-eject-a48304cd3b21) tutorial.

First, install `@angular-builders/custom-webpack` and `@angular-devkit/build-angular`:

```bash
npm i -D @angular-builders/custom-webpack @angular-devkit/build-angular
```

As next step, open `angular.json` and update the `builder` value from `@angular-devkit/build-angular:browser` to `@angular-builders/custom-webpack:browser`:

```json
"architect": {
  ...
  "build": {
      "builder": "@angular-builders/custom-webpack:browser"
      "options": {
        ...
      }
    ...
  }
  ...
}
```

As the next step, add a property with key `customWebpackConfig` to the `options` object residing in `build`:

```json
"architect": {
  ...
  "build": {
      "builder": "@angular-builders/custom-webpack:browser"
      "options": {
        "customWebpackConfig": {
          "path": "./extend.webpack.config.js"
        }
      }
  ...
}
```

As the final step let us configure the Guess.js webpack plugin.

### Configure Guess.js

First, install Guess.js:

```bash
npm i -D guess-webpack guess-parser
```

`guess-webpack` contains the Guess.js webpack plugin. `guess-parser` contains a collection of parsers which can statically analyze our Angular application to discover how the routes from the analytics source map to JavaScript bundles.

To use the Guess.js webpack plugin, create a file called `extend.webpack.config.js` in the root of the project and set the following content:

```js
const { GuessPlugin } = require('guess-webpack');
const { parseRoutes } = require('guess-parser');

module.exports = {
  plugins: [
    new GuessPlugin({
      // Alternatively you can provide a Google Analytics View ID
      // GA: 'XXXXXX',
      reportProvider() {
        return Promise.resolve(JSON.parse(require('fs').readFileSync('./routes.json')));
      },
      runtime: {
        delegate: false
      },
      routeProvider() {
        return parseRoutes('.');
      }
    })
  ]
};
```

In the snippet above, first, we import the `GuessPlugin` and the `parseRoutes` function. The `parseRoutes` function is responsible for creating the mapping between routes from our analytics source to the JavaScript bundles associated with them.

After that, we define our webpack configuration. Inside of it, we export an object with a `plugins` property. Here we add our `GuessPlugin` and we configure it by passing an object with three properties:

- `reportProvider` - returns analytics data that the `GuessPlugin` would consume and build a machine learning model with
- `runtime` - the runtime configuration sets the `delegate` property to `false`. This setting means that we want to let Guess.js handle the bundle prefetching
- `routeProvider` - this method delegates its invocation to `parseRoutes` which returns the mapping between routes and JavaScript chunks

<div style="background-color: #e7f4ff; border-radius: 5px; padding: 20px; margin-bottom: 20px;">
Alternatively, if you're using Google Analytics, instead of providing a <code>reportProvider</code>, you can set the <code>GA</code> property with value your Google Analytics View ID. In this case, Guess.js will fetch data from your Google Analytics account and build the report automatically. For the purpose, you'll have to provide a read-only access to your view.
</div>

That's it! Now let us build the application and see the result:

```bash
npm run build
cd dist/guess-angular && serve -s .
```

On the image below, we can see the prefetching logic that Guess.js added to the application:

<img src="/website/images/angular-after.gif" alt="Angular prefetching" style="display: block; max-width: 450px; margin: auto; margin-bottom: 20px;">

When the user navigates from "Home" to "Example," the browser provides the "Example" bundle from the disk instead of fetching it from the network. We observe this behavior because when the user initially visits the "Home" page, Guess.js prefetches the bundle associated with the "Example" page.

Same happens when the user goes from "About" to "Media" since Guess.js prefetches the "Media" bundles when the user initially visits "About."

### Conclusion

In this guide, we saw how to integrate Guess.js with Angular using Angular CLI.

First, we developed an Angular application with four lazy-loaded routes. As the next step, we observed how on each navigation the browser sends an HTTP request to fetch the resources corresponding to the target page. We noted that in real-life applications this might introduce latency which impacts the user's experience.

After that, we extended the Angular CLI build using `@angular-builders/custom-webpack` and introduced the `GuessPlugin` which built a model from a sample report that we provided from the disk.

Finally, we observed Guess.js' prefetching behavior at runtime.
