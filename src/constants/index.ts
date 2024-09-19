import { createThirdwebClient } from "thirdweb";
import { env } from "~/env";

export const CB_BTC = "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf";
export const CB_BTC_DECIMALS = 8;
export const CB_BTC_IMAGE = "https://basescan.org/token/images/cbbtc_32.png";

export const client = createThirdwebClient({
  clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});