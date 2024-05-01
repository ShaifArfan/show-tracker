import { Anchor, Box, Container, Flex, Text, Title } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

function Footer() {
  return (
    <Box bg="indigo" py="40px" mt="20px">
      <Container>
        <Flex align="center" justify="center" direction="column">
          <Anchor component={Link} href="/">
            <Title c="white">Show Tracker</Title>
          </Anchor>
          <Text c="white">
            Developed with ❤️️ by{' '}
            <Anchor
              href="https://shaifarfan.com/"
              target="_blank"
              underline="always"
              c="white"
              component="a"
            >
              Shaif Arfan
            </Anchor>
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

export default Footer;
