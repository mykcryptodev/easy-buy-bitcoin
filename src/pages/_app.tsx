import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ThirdwebProvider } from "thirdweb/react";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <ThirdwebProvider>
        <Component {...pageProps} />
      </ThirdwebProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
