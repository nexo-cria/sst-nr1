import { X, Trash2, ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function CartDrawer() {
  const { items, removeItem, clearCart, total, isCartOpen, setIsCartOpen } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCheckingOut(false);
    setCheckoutDone(true);
    setTimeout(() => {
      clearCart();
      setCheckoutDone(false);
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slideIn"
        style={{
          animation: 'slideInRight 0.3s ease-out both',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Seu Carrinho</h2>
            {items.length > 0 && (
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {checkoutDone ? (
            <div className="flex flex-col items-center justify-center h-full animate-scaleIn">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pedido Confirmado!</h3>
              <p className="text-sm text-slate-500 text-center">
                Você receberá um e-mail com os detalhes do seu plano e instruções de acesso.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Carrinho vazio
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Adicione um plano para começar a usar o Nexo-SST.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl transition-colors"
              >
                Ver Planos
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.plan.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Plano {item.plan.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.plan.maxEmployees}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.plan.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Qtd: {item.quantity}</span>
                    </div>
                    <div className="text-right">
                      {item.plan.originalPrice && (
                        <p className="text-xs text-slate-400 line-through">
                          R$ {item.plan.originalPrice}
                        </p>
                      )}
                      <p className="text-lg font-extrabold text-emerald-600">
                        R$ {item.plan.price}
                        <span className="text-xs font-normal text-slate-500">/mês</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && !checkoutDone && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-700">
                Total Mensal
              </span>
              <span className="text-2xl font-extrabold text-slate-900">
                R$ {total}
                <span className="text-sm font-normal text-slate-500">/mês</span>
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 transition-all duration-300 active:scale-95 disabled:opacity-70"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Finalizar Assinatura
                </>
              )}
            </button>

            <p className="text-xs text-slate-400 text-center mt-3">
              🔒 Pagamento seguro • 14 dias grátis • Cancele quando quiser
            </p>

            <button
              onClick={clearCart}
              className="w-full mt-3 text-xs text-slate-400 hover:text-rose-500 transition-colors"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
