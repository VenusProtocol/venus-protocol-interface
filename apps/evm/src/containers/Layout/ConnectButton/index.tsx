import { useGetPrimeToken } from "clients/api";
import { Button, type ButtonProps } from "components";
import { useTranslation } from "libs/translations";
import { useAccountAddress, useAuthModal } from "libs/wallet";
import { cn, truncateAddress } from "utilities";

import useResolveAddressToName from "hooks/useResolveAddressToName";
import { PrimeButton } from "./PrimeButton";

export interface ConnectButtonProps
  extends Omit<
    ButtonProps,
    "isAccountPrime" | "accountAddress" | "loading" | "onClick" | "variant"
  > {
  variant?: "primary" | "secondary";
}

const connectedAccountButtonClasses = cn(
  "border-offWhite hover:bg-offWhite hover:border-transparent hover:text-background active:bg-grey active:border-transparent"
);

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  className,
  variant = "primary",
  ...otherProps
}) => {
  const { accountAddress } = useAccountAddress();
  const { openAuthModal } = useAuthModal();
  const { t } = useTranslation();
  const resolvedName = useResolveAddressToName(accountAddress!);

  const { data: getPrimeTokenData, isLoading: isGetPrimeTokenLoading } =
    useGetPrimeToken({
      accountAddress,
    });
  const isAccountPrime = !!getPrimeTokenData?.exists;

  if (isGetPrimeTokenLoading) {
    return null;
  }

  if (accountAddress && isAccountPrime) {
    return (
      <PrimeButton
        accountAddress={accountAddress}
        domainName={resolvedName!}
        onClick={openAuthModal}
        className={cn(
          variant === "secondary" && connectedAccountButtonClasses,
          className
        )}
        {...otherProps}
      />
    );
  }

  return (
    <Button
      variant={accountAddress ? "secondary" : "primary"}
      onClick={openAuthModal}
      className={cn(
        className,
        variant === "secondary" &&
          accountAddress &&
          connectedAccountButtonClasses,
        variant === "secondary" &&
          !accountAddress &&
          "border-transparent bg-offWhite text-background hover:border-transparent hover:bg-grey active:bg-grey active:border-transparent"
      )}
      {...otherProps}
    >
      {accountAddress ? (
        <>{resolvedName || truncateAddress(accountAddress)}</>
      ) : (
        t("connectButton.title")
      )}
    </Button>
  );
};
