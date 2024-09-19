import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import '@coinbase/onchainkit/styles.css';
import { ThirdwebProvider } from "thirdweb/react";
import OnchainProvider from "~/providers/OnchainProvider";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThirdwebProvider>
      <OnchainProvider>
        <Component {...pageProps} />
      </OnchainProvider>
    </ThirdwebProvider>
  );
};

export default api.withTRPC(MyApp);
