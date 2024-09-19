import { type NextPage } from "next";
import { base } from "thirdweb/chains";
import { PayEmbed } from "thirdweb/react";
import { client } from "~/constants";

export const CreditCard: NextPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <PayEmbed
        client={client}
        connectOptions={{
          connectModal: {
            size: "compact",
          },
        }}
        theme={"light"}
        payOptions={{
          buyWithCrypto: false,
          prefillBuy: {
            token: {
              address: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
              name: "Bitcoin",
              symbol: "BTC",
              icon: "https://basescan.org/token/images/cbbtc_32.png",
            },
            chain: base,
            allowEdits: {
              amount: true, // allow editing buy amount
              token: false, // disable selecting buy token
              chain: false, // disable selecting buy chain
            }
          },
        }}
      />
    </div>
  )
};

export default CreditCard;