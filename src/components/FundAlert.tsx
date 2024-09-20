import type { FC } from "react";
import { useAccount, useReadContract } from "wagmi";
import { erc20Abi, zeroAddress, formatUnits } from "viem";
import { USDC, USDC_DECIMALS } from "~/constants";
import { generateOnRampURL } from "@coinbase/cbpay-js";
import Link from "next/link";
import { env } from "~/env";
import BuyCrypto from "./BuyCrypto";
import { WalletAdd01Icon } from "hugeicons-react";

export const FundAlert: FC = () => {
  const { address } = useAccount();

  const { data } = useReadContract({
    address: USDC,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address ?? zeroAddress],
  },);
  const balanceOfUsdc: bigint = data ?? BigInt(0);

  const usdcBalance = Number(formatUnits(balanceOfUsdc, USDC_DECIMALS));

  const FundWalletButton: FC = () => {
    const onRampURL = generateOnRampURL({
      appId: env.NEXT_PUBLIC_COINBASE_PROJECT_ID,
      defaultExperience: "buy",
      destinationWallets: [
        { address: address ?? "", blockchains: ["base"], assets: ["USDC"] }
      ]
    });

    return (
      <Link 
        href={onRampURL}
        passHref
        rel="noopener noreferrer"
        className="btn btn-sm btn-primary"
      >
        Coinbase
      </Link>
    )
  };

  if (!address || usdcBalance === undefined || usdcBalance > 0) return null;

  return (
    <div role="alert" className="alert flex items-start bg-base-100">
      <WalletAdd01Icon className="w-6 h-6 mr-2 text-accent" />
      <div className="flex flex-col w-full">
        <div className="font-bold">Your wallet has no funds.</div>
        <div>Use a method below to fund your wallet.</div>
        <div className="flex gap-2 w-full justify-end mt-4">
          <BuyCrypto>
            <button className="btn btn-sm">Credit Card</button>
          </BuyCrypto>
          <FundWalletButton />
        </div>
      </div>
    </div>
  );
};

export default FundAlert;