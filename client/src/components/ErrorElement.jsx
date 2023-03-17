import { Container, Heading, Text } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";

function ErrorElement() {
   const error = useRouteError();
   console.error(error)
   return ( <Container maxW={"xl"}>
      <Heading>
         Oops!
      </Heading>
      <Text>
         Looks like and error has occurred.
      </Text>
      <Text>
         {error.statusText || error.message}
      </Text>

   </Container> );
}

export default ErrorElement;