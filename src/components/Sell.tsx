import { type FC, useMemo, useState } from "react";
import useDebounce from "~/hooks/useDebounce";
import { api } from "~/utils/api";
import { zeroAddress, encodeFunctionData, parseUnits, erc20Abi } from "viem";
import { useAccount } from "wagmi";
import { base } from "viem/chains";
import { Transaction, TransactionButton, TransactionToast, TransactionToastAction, TransactionToastIcon, TransactionToastLabel } from "@coinbase/onchainkit/transaction";
import { env } from "~/env";
import { CB_BTC, CB_BTC_DECIMALS, USDC } from "~/constants";
import { ArrowLeft02Icon } from "hugeicons-react";

type Props = {
  goBack: () => void;
  onSuccess: () => void;
};

export const Sell: FC<Props> = ({ goBack, onSuccess }) => {
  const account = useAccount();

  const { data: btcPrice } = api.chainlink.getAssetPrice.useQuery({
    asset: "BTC",
  });

  const [amount, setAmount] = useState<string>("");
  const debouncedAmount = useDebounce(amount, 500);

  // the amount equates to how much USD the user wants to receive
  // in order to receive that much, they will need to sell btc
  // so we need to calculate how much btc they need to sell
  const debouncedAmountInBtc = useMemo(() => {
    if (!btcPrice || !debouncedAmount) return "0";
    const amountInBtc = parseFloat(debouncedAmount) / Number(btcPrice);
    return parseUnits(amountInBtc.toString() ?? "0", CB_BTC_DECIMALS).toString();
  }, [debouncedAmount, btcPrice]);

  const { data: encodedData, isLoading: encodedDataIsLoading } =
    api.kyberswap.getCheckoutData.useQuery(
      {
        chainId: base.id,
        from: account?.address ?? zeroAddress,
        to: account?.address ?? zeroAddress,
        tokenToSellAddress: CB_BTC,
        tokensToBuy: [
          {
            address: USDC,
            amount: debouncedAmountInBtc,
          },
        ],
      },
      {
        enabled:
          !!account &&
          !!debouncedAmountInBtc &&
          debouncedAmountInBtc !== "0",
      },
    );

  const calls = useMemo(() => {
    if (!encodedData) return [];
    const approveBtcToRouterData = encodeFunctionData({
      abi: erc20Abi,
      functionName: "approve",
      args: [encodedData[0]!.data.routerAddress, BigInt(encodedData[0]!.data.amountIn)],
    });
    const approvalTx = {
      to: CB_BTC as `0x${string}`,
      data: approveBtcToRouterData,
      value: BigInt(0),
    };
    const sellCalls = encodedData?.map(({ data }) => ({
      to: data.routerAddress as `0x${string}`,
      data: data.data as `0x${string}`,
      value: BigInt(0),
    })) ?? []
    return [approvalTx, ...sellCalls];
  }, [encodedData]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button className="btn btn-neutral btn-xs btn-ghost" onClick={goBack}>
        <ArrowLeft02Icon size={18} /> 
        Go back
      </button>
      <label htmlFor="sellAmount" className="text-sm font-medium">
        Amount of USD to sell in Bitcoin:
      </label>
      <input
        id="sellAmount"
        type="number"
        min="0"
        step="0.00000001"
        value={amount}
        onChange={handleAmountChange}
        className="input input-bordered"
        placeholder="Enter amount in BTC"
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
          text={`${encodedDataIsLoading ? "Loading..." : `Sell ${Number(amount).toLocaleString([], { style: "currency", currency: "USD" })} of Bitcoin`}`}
          disabled={encodedDataIsLoading}
          className="bg-none! hover:bg-none! p-0 span-secondary-content-text-color btn btn-secondary btn-lg"
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
