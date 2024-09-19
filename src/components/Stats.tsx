import { BitcoinGraphIcon, BitcoinWalletIcon, Wallet01Icon, WalletAdd02Icon } from "hugeicons-react";
import type { FC } from "react";
import AnimatedNumber from "~/components/AnimatedNumber";
import { useAccount, useReadContracts } from "wagmi";
import { erc20Abi, zeroAddress, formatUnits } from "viem";
import { CB_BTC, CB_BTC_DECIMALS, USDC, USDC_DECIMALS } from "~/constants";
import BuyCrypto from "./BuyCrypto";

type Props = {
  priceChange: number;
  btcPrice: number;
}

export const Stats: FC<Props> = ({ priceChange, btcPrice }) => {
  const { address } = useAccount();

  const { data } = useReadContracts({
    contracts: [
      {
        address: CB_BTC,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address ?? zeroAddress],
      },
      {
        address: USDC,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address ?? zeroAddress],
      },
    ],
  });
  const balanceOfBtc: bigint = data?.[0]?.result ?? BigInt(0);
  const balanceOfUsdc: bigint = data?.[1]?.result ?? BigInt(0);

  const btcBalance = Number(formatUnits(balanceOfBtc, CB_BTC_DECIMALS));
  const usdcBalance = Number(formatUnits(balanceOfUsdc, USDC_DECIMALS));

  return (
    <div className="stats-container overflow-x-auto">
      <div className="stats bg-transparent flex-nowrap">
        <div className="stat">
          <div className="stat-title text-sm">BTC Price</div>
          <div className="stat-figure text-secondary">
            <BitcoinGraphIcon className="h-8 w-8 stroke-2" />
          </div>
          <div className="stat-value">
            <AnimatedNumber
              value={btcPrice}
              formatOptions={{
                style: "currency",
                currency: "usd",
                maximumFractionDigits: 0,
              }}
            />
          </div>
          <div className={`stat-desc ${priceChange ?? 0 > 0 ? 'text-success' : ''}`}>
            {priceChange > 0 && (
              <span>+</span>
            )}
            {priceChange.toLocaleString([], {
              maximumFractionDigits: 2,
            })}% today
          </div>
        </div>
        <div className="stat !border-l-0">
          <div className="stat-title text-sm">Your BTC Wallet</div>
          <div className="stat-figure text-secondary">
            <BitcoinWalletIcon className="h-8 w-8 stroke-2" />
          </div>
          <div className="stat-value">
            <AnimatedNumber
              value={btcBalance * btcPrice}
              formatOptions={{
                style: "currency",
                currency: "usd",
                maximumFractionDigits: 2,
              }}
            />
          </div>
          <div className="stat-desc">
            {btcBalance.toFixed(8)} BTC
          </div>
        </div>
        <div className="stat !border-l-0">
          <div className="stat-title text-sm">Your USD Wallet</div>
          <div className="stat-figure text-secondary">
            <Wallet01Icon className="h-7 w-7 stroke-2" />
          </div>
          <div className="stat-value">
            <AnimatedNumber
              value={usdcBalance}
              formatOptions={{
                style: "currency",
                currency: "usd",
                maximumFractionDigits: 2,
              }}
            />
          </div>
          <div className="stat-desc flex items-center gap-1">
            {/* <WalletAdd02Icon className="h-4 w-4" />
            Add Money */}
            <BuyCrypto
              button={
                <div className="btn btn-xs font-normal btn-ghost flex items-center gap-1">
                  <WalletAdd02Icon className="h-4 w-4" />
                  Add Money
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
};

export default Stats;