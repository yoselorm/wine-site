import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, ArrowDownLeft, ArrowUpRight, Wallet as WalletIcon } from 'lucide-react';
import { fetchWallet } from '../../redux/walletSlice';
import toast from '../../components/Toast';

const Wallet = () => {
  const dispatch = useDispatch();
  const { balance, currency, transactions, loading, error } = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  const handleTopUp = () => {
    toast.success('Top-up is coming soon');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-6">
        <div className="h-8 w-48 bg-zinc-100" />
        <div className="h-40 bg-zinc-100 rounded-xl" />
        <div className="h-64 bg-zinc-100 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto text-center py-24">
        <p className="text-wine mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchWallet())}
          className="text-xs font-bold uppercase tracking-widest border-b border-forest pb-1 hover:text-forest transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10 border-b border-zinc-200 pb-6">
        <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 mb-2">My Wallet</h1>
        <p className="text-sm text-zinc-500 font-light">Manage your balance and view transaction history</p>
      </div>

      <div className="bg-forest rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-white mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <WalletIcon size={14} className="text-cream/50" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cream/50">Available Balance</span>
          </div>
          <p className="font-serif text-4xl">
            {currency} {Number(balance).toFixed(2)}
          </p>
        </div>
        <button
          onClick={handleTopUp}
          className="bg-gold text-forest-dark px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gold-light transition-colors duration-300 shrink-0"
        >
          Top Up
        </button>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl p-8">
        <h3 className="font-serif text-xl text-zinc-900 mb-6">Transaction History</h3>

        {transactions.length === 0 ? (
          <div className="text-center py-16">
            <CreditCard size={36} strokeWidth={1} className="text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 font-light">No transactions yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {transactions.map((tx) => {
              const isCredit = Number(tx.amount) >= 0;
              return (
                <div key={tx.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isCredit ? 'bg-green-50 text-green-600' : 'bg-wine/5 text-wine'
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">
                        {tx.description || (isCredit ? 'Wallet top-up' : 'Purchase')}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {tx.created_at
                          ? new Date(tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : ''}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold shrink-0 ${isCredit ? 'text-green-600' : 'text-wine'}`}>
                    {isCredit ? '+' : '-'}
                    {currency} {Math.abs(Number(tx.amount)).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
