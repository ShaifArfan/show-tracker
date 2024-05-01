import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import { Box, Container, Flex } from '@mantine/core';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex h="100vh" direction="column" justify="space-between">
      {/* top */}
      <Box>
        <Header />
        <Container>{children}</Container>
      </Box>

      {/* Bottom */}
      <Box>
        <Footer />
      </Box>
    </Flex>
  );
}

export default layout;
