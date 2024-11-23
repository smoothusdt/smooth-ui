import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// TODO: Get intellisense for keys

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      language: "Language",
      logOut: "Log Out",
      send: "Send",
      receive: "Receive",
      sent: "Sent",
      received: "Received",
      sending: "Sending...",
      receipt: "Receipt",
      transactionId: "Transaction ID:",
      senderAddress: "Sender Address:",
      recipientAddress: "Recipient Address:",
      amount: "Amount:",
      recentTransfers: "Recent Transfers",
      yourBlance: "Your Balance",
      enterDetails: "Enter Details",
      availableAmount: "Available:",
      continue: "Continue",
      sendUsdt: "Send USDT",
      receiveUsdt: "Receive USDT",
      walletQrLabel: "Show this QR code to receive funds",
      yourWalletAddress: "Your wallet address:",
      copyAddress: "Copy address",
      copied: "Copied",
      status: "Status:",
      completed: "Completed",
      date: "Date:",
      transferDetails: "Transfer Details",
      viewOnTronscan: "View on Tronscan",
      settings: "Settings",
      network: "Network:",
      networkFee: "Network Fee:",
      loggingOut: "Logging Out...",
      createWallet: "Create Wallet",
      logIn: "Log In",
      usdtFeesFeature: "Pay network fees in USDT instead of TRX.",
      nonCustodialFeature: "Non-custodial wallet, but no secret phrases.",
      securityFeature: "Modern smart contract based security.",
      smoothDescription: "A simple crypto wallet to receive and send USDT TRC-20",
      errorEnterRecipient: "Enter recipient address.",
      errorInvalidRecipient: "$1 is not a valid address.",
      errorEnterAmount: "Enter amount.",
      errorNegativeAmount: "Amount cannot be negative.",
      errorLimitExceeded: "Maximum $1 USDT can be sent.",
      confirmTransfer: "Confirm Transfer",
      transferNotFound: "Transfer Not Found",
      whatsNext: "What's next?",
      emptyHistoryPlaceholder: "Your transfers will be displayed here."
    },
  },
  ru: {
    translation: {
      language: "Язык",
      logOut: "Выйти",
      send: "Отправить",
      receive: "Получить",
      sent: "Отправлено",
      received: "Получено",
      sending: "Отправка...",
      receipt: "Чек",
      transactionId: "ID транзакции:",
      senderAddress: "Адрес отправителя:",
      recipientAddress: "Адрес получателя:",
      amount: "Сумма:",
      recentTransfers: "Последние переводы",
      yourBlance: "Ваш баланс",
      enterDetails: "Введите реквизиты",
      availableAmount: "Доступно:",
      continue: "Дальше",
      sendUsdt: "Отправить USDT",
      receiveUsdt: "Получить USDT",
      walletQrLabel: "Покажите этот QR код для получения средств",
      yourWalletAddress: "Адрес вашего кошелька:",
      copyAddress: "Копировать адрес",
      copied: "Cкопировано",
      status: "Статус:",
      completed: "Исполнено",
      date: "Дата:",
      transferDetails: "Детали перевода",
      viewOnTronscan: "Посмотреть на Tronscan",
      settings: "Настройки",
      network: "Сеть:",
      networkFee: "Комиссия сети:",
      loggingOut: "Выполняется выход...",
      createWallet: "Создать кошелек",
      logIn: "Войти",
      usdtFeesFeature: "Оплачивайте комиссию сети в USDT, а не в TRX.",
      nonCustodialFeature: "Некастодиальный кошелек, но при этом без секретных фраз.",
      securityFeature: "Современная защита средств основанная на смарт контрактах.",
      smoothDescription: "Простой криптокошелек для получения и отправки USDT TRC-20",
      errorEnterRecipient: "Укажите адрес получателя.",
      errorInvalidRecipient: "$1 это некорректный адрес.",
      errorEnterAmount: "Введите сумму.",
      errorNegativeAmount: "Сумма не может быть отрицательной.",
      errorLimitExceeded: "Максимум $1 USDT может быть отправлено.",
      confirmTransfer: "Подтвердите перевод",
      transferNotFound: "Перевод не найден",
      whatsNext: "Что дальше?",
      emptyHistoryPlaceholder: "Здесь будут отображаться ваши переводы."
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    lng: "en", // Gets overriden by PreferencesContext anyway
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
