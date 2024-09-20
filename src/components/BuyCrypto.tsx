import { type ReactNode, type FC } from "react";
import { base } from "thirdweb/chains";
import { PayEmbed } from "thirdweb/react";
import { client, USDC } from "~/constants";

type Props = {
  children: ReactNode;
}
export const BuyCrypto: FC<Props> = ({ children }) => {
  return (
    <>
    
      {/* The button to open modal */}
      <label htmlFor="credit-card-modal" className="">
        {children}
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="credit-card-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle" role="dialog">
        <div className="modal-box sm:w-fit p-0">
          <div className="flex w-full justify-center">
            <PayEmbed
              client={client}
              theme={"light"}
              style={{
                border: "0px"
              }}
              payOptions={{
                buyWithCrypto: false,
                metadata: {
                  name: "Add Money",
                },
                prefillBuy: {
                  token: {
                    address: USDC,
                    name: "US Dollar",
                    symbol: "USDC",
                    icon: "/images/usdc.png"
                  },
                  chain: base,
                  allowEdits: {
                    amount: true, // allow editing buy amount
                    token: false, // disable selecting buy token
                    chain: false, // disable selecting buy chain
                  },
                },
              }}
            />
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="credit-card-modal">Close</label>
      </div>
    </>
  )
};

export default BuyCrypto;