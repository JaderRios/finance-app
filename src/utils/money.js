const SUPPORTED_CURRENCIES = new Set(['PEN', 'USD']);

const formatters = new Map();

function getFormatter(currency) {
  const safeCurrency = SUPPORTED_CURRENCIES.has(currency) ? currency : 'PEN';

  if (!formatters.has(safeCurrency)) {
    formatters.set(
      safeCurrency,
      new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: safeCurrency,
      })
    );
  }

  return formatters.get(safeCurrency);
}

export function getTransactionCurrency(transaction) {
  return transaction.currency || transaction.accounts?.currency || 'PEN';
}

export function formatMoneyByCurrency(amount, currency) {
  return getFormatter(currency).format(Number(amount || 0));
}

export function formatTransactionAmount(transaction) {
  return formatMoneyByCurrency(transaction.amount, getTransactionCurrency(transaction));
}
