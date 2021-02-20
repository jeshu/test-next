import React from "react";
import { Container, Typography, Box, Button } from "@material-ui/core";
import Link from "next/link";

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Droan Squad
        </Typography>
        <Link href="/auth/signin">
          <Button variant="contained" color="primary">
            Sign in
          </Button>
        </Link>
      </Box>
    </Container>
  );
}