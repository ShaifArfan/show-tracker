import { Center, Container } from '@mantine/core';
import React from 'react';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container py={100}>
      <Center w="100%">{children}</Center>
    </Container>
  );
}

export default AuthLayout;
