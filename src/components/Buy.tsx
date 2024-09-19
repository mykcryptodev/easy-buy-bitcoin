import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
} from "@coinbase/onchainkit/transaction";
import { type FC, useMemo, useState } from "react";
import { CB_BTC } from "~/constants";
import { api } from "~/utils/api";
import { useAccount } from "wagmi";
import { base } from "viem/chains";
import { parseEther, zeroAddress } from "viem";
import useDebounce from "~/hooks/useDebounce";
import { env } from "~/env";
import { ArrowLeft02Icon } from "hugeicons-react";

type Props = {
  goBack: () => void;
};
export const Buy: FC<Props> = ({ goBack }) => {
  const account = useAccount();
  const { data: etherPrice } = api.chainlink.getAssetPrice.useQuery({
    asset: "ETH",
  });

  const [amount, setAmount] = useState<string>("");
  const debouncedAmount = useDebounce(amount, 500);
  const debouncedAmountInEther = useMemo(() => {
    if (!etherPrice || !debouncedAmount) return "0";
    const amountInEther = parseFloat(debouncedAmount) / Number(etherPrice);
    return parseEther(amountInEther.toString() ?? "0").toString();
  }, [debouncedAmount, etherPrice]);

  const { data: encodedData, isLoading: encodedDataIsLoading } =
    api.kyberswap.getCheckoutData.useQuery(
      {
        chainId: base.id,
        from: account?.address ?? zeroAddress,
        to: account?.address ?? zeroAddress,
        tokensToBuy: [
          {
            token: CB_BTC,
            amount: debouncedAmountInEther,
          },
        ],
      },
      {
        enabled:
          !!account &&
          !!debouncedAmountInEther &&
          debouncedAmountInEther !== "0",
      },
    );

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const calls = useMemo(() => {
    return (
      encodedData?.map(({ data }) => ({
        to: data.routerAddress as `0x${string}`,
        data: data.data as `0x${string}`,
        value: BigInt(data.amountIn),
      })) ?? []
    );
  }, [encodedData]);

  return (
    <div className="flex flex-col items-start gap-2">
      <button className="btn btn-neutral btn-xs btn-ghost" onClick={goBack}>
        <ArrowLeft02Icon size={18} /> 
        Go back
      </button>
      <label htmlFor="buyAmount" className="text-sm font-medium">
        Amount in USD to buy Bitcoin:
      </label>
      <input
        id="buyAmount"
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={handleAmountChange}
        className="input input-lg input-bordered"
        placeholder="Enter amount in USD"
      />
      <Transaction 
        chainId={base.id} 
        calls={calls}
        capabilities={{
          paymasterService: {
            url: env.NEXT_PUBLIC_CDP_PAYMASTER_URL,
          }
        }}
      >
        <TransactionButton
          text={`${encodedDataIsLoading ? "Loading..." : `Buy ${Number(amount).toLocaleString([], { style: "currency", currency: "USD" })} of Bitcoin`}`}
          disabled={encodedDataIsLoading}
          className="bg-none! hover:bg-none! p-0 text-primary-content! btn btn-primary btn-lg"
        />
        <TransactionToast>
          <TransactionToastIcon />
          <TransactionToastLabel />
          <TransactionToastAction />
        </TransactionToast>
      </Transaction>
    </div>
  );
};
