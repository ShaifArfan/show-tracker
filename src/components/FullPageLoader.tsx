import { Center, Loader } from '@mantine/core';
import React from 'react';

function FullPageLoader() {
  return (
    <Center
      pos="absolute"
      left={0}
      top={0}
      right={0}
      bottom={0}
      h="100vh"
      w="100vw"
      style={{
        zIndex: 1000,
      }}
    >
      <Loader color="indigo" />
    </Center>
  );
}

export default FullPageLoader;
