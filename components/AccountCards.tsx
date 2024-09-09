import React from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import { useGetAccounts } from '@/hooks/accounts/api/useGetAccounts';

export const AccountCards = () => {
    const { isLoaded, user } = useUser();
    const accountsQuery = useGetAccounts();
    const accounts = accountsQuery.data || [];

    if (accountsQuery.isLoading || !isLoaded) {
        return <div className="h-[400px] w-full flex items-center justify-center">
            <Loader2 className="size-6 text-slate-300 animate-spin" />
        </div>
    }

    return <div className="flex flex-wrap gap-6">
        {accounts.map((account) => (
            <div key={account.id} className="flex flex-col">
                <div className="relative flex h-[205px] w-[380px] justify-between rounded-[20px] border border-white bg-bank-gradient backdrop-blur-[6px]">
                    <div className="relative z-10 flex size-full w-[288px] flex-col justify-between rounded-l-[20px] bg-gray-700 bg-bank-gradient px-5 pb-4 pt-5">
                        <div>
                            <h1 className="text-[16px] leading-[24px] font-semibold text-white">
                                {account.name}
                            </h1>
                            <p className="font-black text-white">
                                {formatCurrency(account.balance)}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                                <h1 className="text-[12px] leading-[16px] font-semibold text-white">
                                    {user?.firstName}
                                </h1>
                                <h2 className="text-[12px] leading-[16px] font-semibold text-white">
                                    ●● / ●●
                                </h2>
                            </div>
                            <p className="text-[14px] leading-[20px] font-semibold tracking-[1.1px] text-white">
                                ●●●● ●●●● ●●●● <span className="text-[16px] leading-[24px]">{account?.mask}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex size-full flex-1 flex-col items-end justify-between rounded-r-[20px] bg-green-500 bg-cover bg-center bg-no-repeat py-5 pr-5">
                        <Image 
                            src="/paypass-icon.svg"
                            width={20}
                            height={24}
                            alt="pay"
                        />
                        <Image 
                            src="/mastercard-icon.svg"
                            width={45}
                            height={32}
                            alt="mastercard"
                            className="ml-5"
                        />
                    </div>

                    <Image 
                        src="/lines.svg"
                        width={316}
                        height={190}
                        alt="lines"
                        className="absolute top-0 left-16"
                    />
                </div>
            </div>
        ))}
    </div>
};
