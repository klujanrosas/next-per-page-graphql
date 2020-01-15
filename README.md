:warning: This is most likely outdated at this point. It was a fun experiment based(like 99%) on the awesome work being done by @lfades in https://github.com/lfades/next-with-apollo go check it out :construction_worker:


### Next.js and Apollo

This example here implements a High-Order Component that enables GraphQL related utilities to be used, and works for wrapping both Next.js's `_app.js` or individual pages.

#### Enabling GraphQL for the whole app

This will enable the usage of GraphQL related utilities in the entire app.

```js
// pages/_app.js
import { ApolloProvider } from "@apollo/react-ssr";

import withApollo from "./apollo/with-apollo";

function App({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default withApollo()(App);
```

#### Enabling GraphQL on a per-page basis

This allows you to add the graphql set up on a per-page basis 🛩
Doesn't need a custom `_app.js` file.

```js
// pages/my-page.js
import { ApolloProvider } from "@apollo/react-ssr";

import withApollo from "./apollo/with-apollo";

function MyPage() {
  const { data, error, loading } = useQuery(someQuery);

  if (loading) return "Loading...";
  if (error) return "Oopsie...";

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default withApollo()(({ apollo, ...props }) => (
  <ApolloProvider client={apollo}>
    <MyPage {...props} />
  </ApolloProvider>
));
```
