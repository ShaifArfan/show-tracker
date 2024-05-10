import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

// mantine styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ModalsProvider } from '@mantine/modals';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <ColorSchemeScript defaultColorScheme="dark" />
        <MantineProvider defaultColorScheme="dark">
          <ModalsProvider>
            <Notifications />
            {children}
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
