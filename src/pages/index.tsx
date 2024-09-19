import Head from "next/head";
import { useEffect, useState } from "react";
import type { FC } from "react";
import { Buy } from "~/components/Buy";
import { Sell } from "~/components/Sell";
import { api } from "~/utils/api";
import Wallet from "~/components/Wallet";
import { useAccount } from "wagmi";
import dynamic from "next/dynamic";
import Stats from "~/components/Stats";
import { zeroAddress } from "viem";
import { base } from "viem/chains";
import { CB_BTC } from "~/constants";

const PriceChart = dynamic(() => import("~/components/PriceChart"), { ssr: false });

const Home: FC = () => {
  const { address } = useAccount();
  const [price, setPrice] = useState<number>(45000);
  const { data } = api.coingecko.getTokenCardDataById.useQuery({
    id: "coinbase-wrapped-btc",
  });
  useEffect(() => {
    if (!data)  return;
    setPrice(data.current_price);
  }, [data, data?.current_price]);

  const { data: pnl } = api.moralis.getWalletPnl.useQuery({
    address: address ?? zeroAddress,
    chainId: base.id,
    tokens: [CB_BTC],
  }, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!address,
  });

  console.log({ pnl });

  const [activeAction, setActiveAction] = useState<"buy" | "sell" | undefined>();
  
  return (
    <>
      <Head>
        <title>Buy Bitcoin</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-full min-h-screen justify-center">
        {data && (
          <div className="absolute w-full h-full">
            <PriceChart buys={pnl?.buys} sells={pnl?.sells} />
          </div>
        )}
        <div className="flex flex-col sm:mt-40 mt-20">
          {address && (<Wallet className="z-20 mx-auto" />)}
          <div className="flex flex-col items-center justify-center max-w-md gap-2 z-10 rounded-2xl">
            {data && (
              <Stats
                priceChange={data.price_change_percentage_24h}
                btcPrice={price}
              />
            )}
            <div className="text-7xl tracking-tighter font-bold my-8">Buy Bitcoin</div>
            {(!activeAction && address) && (
              <div className="flex justify-center w-full max-w-md items-center gap-2">
                <button 
                  className="btn btn-lg w-1/2 btn-primary"
                  onClick={() => setActiveAction("buy")}
                >
                  Buy
                </button>
                <button 
                  className="btn btn-lg w-1/2 btn-secondary"
                  onClick={() => setActiveAction("sell")}
                >
                  Sell
                </button>
              </div>
            )}
            {!address && (
              <Wallet />
            )}
            {activeAction === "buy" && (
              <Buy goBack={() => setActiveAction(undefined)} />
            )}
            {activeAction === "sell" && (
              <Sell goBack={() => setActiveAction(undefined)} />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
