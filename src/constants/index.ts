import { createThirdwebClient } from "thirdweb";
import { env } from "~/env";

export const CB_BTC = "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf";
export const CB_BTC_DECIMALS = 8;
export const CB_BTC_IMAGE = "https://basescan.org/token/images/cbbtc_32.png";
export const CB_BTC_COINGECKO_ID = "coinbase-wrapped-btc";

export const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const USDC_DECIMALS = 6;

export const client = createThirdwebClient({
  clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});