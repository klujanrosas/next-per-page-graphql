import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import fetch from "isomorphic-unfetch";

let apolloClient = null;

function create(initialState) {
  const isServer = typeof window === "undefined";

  return new ApolloClient({
    ssrMode: isServer,
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      new HttpLink({
        uri: "https://countries.trevorblades.com/",
        credentials: "same-origin",
        fetch: isServer && fetch
      })
    ]),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo(initialState) {
  if (typeof window === "undefined") {
    return create(initialState);
  }

  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
