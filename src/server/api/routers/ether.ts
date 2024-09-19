import { createThirdwebClient, getContract, toTokens } from "thirdweb";
import { ethereum } from "thirdweb/chains";

import { env } from "~/env";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { decimals, latestRoundData } from "~/thirdweb/1/0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419";

const client = createThirdwebClient({
  clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

export const etherRouter = createTRPCRouter({
  getPrice: publicProcedure
    .query(async () => {
      const NATIVE_ASSET_PRICE_ORACLE = "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419";
      const contract = getContract({
        client,
        chain: ethereum,
        address: NATIVE_ASSET_PRICE_ORACLE,
      });
      try {
        const [decimalsInPrice, latestRound] = await Promise.all([
          decimals({ contract }),
          latestRoundData({ contract }),
        ]);
        return toTokens(latestRound[1].toString(), decimalsInPrice);
      } catch (e) {
        const error = e as Error;
        throw new Error(error.message);
      }
    }),
});