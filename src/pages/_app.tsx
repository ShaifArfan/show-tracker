import type { AppProps } from "next/app";
import "@picocss/pico/css/pico.min.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="container">
      <Component {...pageProps} />
    </div>
  );
}
