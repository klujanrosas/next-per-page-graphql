import React from "react";
import Head from "next/head";

import initApollo from "./init";

function getDisplayName(Component) {
  return Component.displayName || Component.name || "Unknown";
}

const withApollo = () => {
  return PageOrApp => {
    function WithApollo({ apollo, apolloState, ...props }) {
      const apolloClient = apollo || initApollo(apolloState?.data);

      return <PageOrApp {...props} apollo={apolloClient} />;
    }

    const getInitialProps = PageOrApp.getInitialProps;

    WithApollo.displayName = `WithApollo(${getDisplayName(PageOrApp)})`;

    WithApollo.getInitialProps = async pageCtx => {
      const isNextApp = "Component" in pageCtx;
      const ctx = isNextApp ? pageCtx.ctx : pageCtx;

      const { AppTree } = pageCtx;
      const apollo = initApollo();
      const apolloState = {};

      let pageProps = {};

      if (getInitialProps) {
        pageProps = await getInitialProps(pageCtx);
      }

      if (typeof window === "undefined") {
        if (ctx.res && (ctx.res.headersSent || ctx.res.finished)) {
          return pageProps;
        }

        try {
          const { getDataFromTree } = await import("@apollo/react-ssr");

          let treeProps = {};

          if (isNextApp) {
            treeProps = {
              ...pageProps,
              apollo,
              apolloState
            };
          } else {
            treeProps = {
              pageProps: { ...pageProps, apollo, apolloState }
            };
          }

          await getDataFromTree(<AppTree {...treeProps} />);
        } catch (error) {
          // Prevent Apollo Client GraphQL errors from crashing SSR.
          if (process.env.NODE_ENV !== "production") {
            console.error("GraphQL error occurred [getDataFromTree]", error);
          }
        }

        Head.rewind();

        apolloState.data = apollo.cache.extract();
      }

      // this makes sure to reuse the apollo instance server-side
      // and send `null` when serializing for the client
      apollo.toJSON = () => null;

      // Next.js first tries to load getInitialProps for App
      // then it gets the current Component from `ctx.Component`
      // the first time around when executing `getDataFromTree`
      // it won't have these returned values cause execution hasn't finished yet
      // that's why in `getDataFromTree` we "fake" the `pageProps` because it's spread automatically by next.js
      return {
        ...pageProps,
        apolloState,
        apollo
      };
    };

    return WithApollo;
  };
};

export default withApollo;
