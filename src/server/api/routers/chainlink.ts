import { createThirdwebClient, getContract, toTokens } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { z } from "zod";

import { env } from "~/env";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { decimals, latestRoundData } from "~/thirdweb/1/0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419";

const client = createThirdwebClient({
  clientId: env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

const getOracleAddress = (asset: string) => {
  switch (asset) {
    case "ETH":
      return "0xf403008d7142c890f4acf6b90d85591db4d7b7e3";
    default:
      return "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c"; // BTC / USD
  }
}

export const chainlinkRouter = createTRPCRouter({
  getAssetPrice: publicProcedure
    .input(z.object({ asset: z.enum(["ETH", "BTC"]) }))
    .query(async ({ input }) => {
      const oracleAddress = getOracleAddress(input.asset);
      const contract = getContract({
        client,
        chain: ethereum,
        address: oracleAddress,
      });
      try {
        const [decimalsInPrice, latestRound] = await Promise.all([
          decimals({ contract }),
          latestRoundData({ contract }),
        ]);
        return toTokens(latestRound[1], decimalsInPrice);
      } catch (e) {
        const error = e as Error;
        throw new Error(error.message);
      }
    }),
});