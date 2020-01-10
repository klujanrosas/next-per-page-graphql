import React from "react";
import gql from "graphql-tag";
import { useQuery, ApolloProvider } from "@apollo/react-hooks";

import withApollo from "../apollo/with-apollo";

const countries = gql`
  {
    countries {
      name
      languages {
        code
        name
      }
    }
  }
`;

function Main() {
  const { data, error, loading } = useQuery(countries);

  if (loading) return <h1>loading...</h1>;
  if (error) return <h1>error D:</h1>;

  return (
    <ul>
      {data?.countries?.map(country => {
        return (
          <li key={country.name}>
            {country.name} (
            {country?.languages?.map(language => language.name).join(",")})
          </li>
        );
      })}
    </ul>
  );
}

function WrappedMain(props) {
  return (
    <ApolloProvider client={props.apollo}>
      <Main {...props} />
    </ApolloProvider>
  );
}

export default withApollo()(WrappedMain);
