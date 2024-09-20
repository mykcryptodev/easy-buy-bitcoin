import { z } from "zod";
import Moralis from "moralis";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { env } from "~/env";
import { getAddress, toHex } from "thirdweb";
import { isAddressEqual } from "viem";

export const moralisRouter = createTRPCRouter({
  getWalletNetworth: publicProcedure
    .input(z.object({
      chainIds: z.array(z.number()),
      address: z.string(),
    }))
    .query(async ({ input }) => {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: env.MORALIS_API_KEY,
        });
      }
    
      const networthResponse = await Moralis.EvmApi.wallets.getWalletNetWorth({
        "chains": input.chainIds.map(chainId => `0x${chainId.toString(16)}`),
        "excludeSpam": true,
        "excludeUnverifiedContracts": true,
        "address": input.address,
      });
      return networthResponse.toJSON();
    }),
  getPortfolioPositions: publicProcedure
    .input(z.object({
      chainId: z.number(),
      address: z.string(),
      tokenAddresses: z.array(z.string()).optional(),
    }))
    .query(async ({ input }) => {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: env.MORALIS_API_KEY,
        });
      }
    
      const portfolioResponse = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
        "chain": `0x${input.chainId.toString(16)}`,
        "excludeSpam": true,
        "address": input.address,
        "tokenAddresses": input.tokenAddresses,
      });
      return portfolioResponse.result;
    }),
  getWalletPerformance: publicProcedure
    .input(z.object({
      days: z.string().default("30"),
      chainId: z.number(),
      address: z.string(),
      tokens: z.array(z.string()).optional(),
    }))
    .query(async ({ input }) => {
      const { chainId, address, days, tokens } = input;
      if (!address) return null;
      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: env.MORALIS_API_KEY,
        });
      }
   
      const response = await Moralis.EvmApi.wallets.getWalletProfitability({
        days,
        chain: toHex(chainId),
        address,
        tokenAddresses: tokens,
      });

      const data = response.toJSON();
      const filteredData = {
        ...data,
        // filter out WETH
        result: data.result?.filter(item => item.token_address !== "0x4200000000000000000000000000000000000006")
      };
      return filteredData;
    }),
  getWalletPnl: publicProcedure
    .input(z.object({
      chainId: z.number(),
      address: z.string(),
      tokens: z.array(z.string()).optional(),
    }))
    .query(async ({ input }) => {
      console.log({ input });
      const { chainId, address, tokens } = input;
      if (!address) return null;
      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: env.MORALIS_API_KEY,
        });
      }
      
      // TODO: This is limited to the last 100 transfers unless we paginate
      // let cursor: string | undefined;
      // const allTransfers: GetWalletTokenTransfersResponseAdapter['result'] = [];

      // do {
      //   const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
      //     chain: toHex(chainId),
      //     address,
      //     contractAddresses: tokens,
      //     cursor,
      //   });

      //   allTransfers.push(...response.result);
      //   cursor = response.pagination.cursor;
      // } while (cursor !== undefined);
      const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
        chain: toHex(chainId),
        order: "DESC",
        address: getAddress(address),
        contractAddresses: tokens?.map(getAddress),
        // cursor,
      });

      // allTransfers.push(...response.result);
      // cursor = response.pagination.cursor;

      const buys = response.result.filter(transfer => isAddressEqual(transfer.toAddress.checksum, getAddress(address)));
      const sells = response.result.filter(transfer => isAddressEqual(transfer.fromAddress.checksum, getAddress(address)));

      return { buys, sells }
    }),
  getTokenPriceAtBlock: publicProcedure
    .input(z.object({
      chainId: z.number(),
      tokenAddress: z.string(),
      blockNumber: z.number(),
    }))
    .mutation(async ({ input }) => {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: env.MORALIS_API_KEY,
        });
      }

      const response = await Moralis.EvmApi.token.getTokenPrice({
        chain: toHex(input.chainId),
        address: getAddress(input.tokenAddress),
        toBlock: input.blockNumber,
      });

      return response.result;
    }),
});