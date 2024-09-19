import { 
  ConnectWallet, 
  ConnectWalletText, 
  Wallet as OnchainKitWallet, 
  WalletDropdown, 
  WalletDropdownDisconnect,
  WalletDropdownFundLink, 
} from '@coinbase/onchainkit/wallet'; 
import {
  Address,
  Avatar,
  Name,
  Identity,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import { useAccount } from "wagmi";
 
type Props = {
  className?: string;
};
export function Wallet({ className }: Props) {
  const account = useAccount();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <OnchainKitWallet>
        <ConnectWallet className={`bg-none! ${account?.address ? '' : 'p-0'} text-primary-content!`}>
          <ConnectWalletText className="btn btn-lg w-full btn-primary">Sign In</ConnectWalletText>
          <Avatar className="h-6 w-6 svg-fill-base" />
          <Name className="text-base!" />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className={color.foregroundMuted} />
          </Identity>
          <WalletDropdownDisconnect />
          <WalletDropdownFundLink />
        </WalletDropdown>
      </OnchainKitWallet>
      {!account.address && (
        <OnchainKitWallet>
          <ConnectWallet className="bg-none! p-0 text-primary-content!">
            <ConnectWalletText className="btn btn-lg btn-secondary">Create Account</ConnectWalletText>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
        </OnchainKitWallet>
      )}
    </div>
  );
}

export default Wallet;