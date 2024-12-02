import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// TODO: Get intellisense for keys

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      welcomeWindow: {
        usdtFeesFeature: "Pay network fees in USDT instead of TRX.",
        nonCustodialFeature: "Compatible with all crypto exchanges.",
        securityFeature: "Non-custodial wallet. No identity verification.",
        smoothDescription: "A simple crypto wallet to receive and send USDT TRC-20",
        createWallet: "Create Wallet",
        importWallet: "Import Wallet",
      },
      settingsWindow: {
        settings: "Settings",
        language: "Language",
        logOut: "Log Out",
      },
      homeWindow: {
        send: "Send",
        receive: "Receive",
        yourBlance: "Your Balance",
      },
      historyComponent: {
        recentTransfers: "Recent Transfers",
        emptyHistoryPlaceholder: "Your transfers will be displayed here.",
        getTestnetUsdt: "Get testnet USDT",
        processing: "Processing...",
        sent: "Sent",
        received: "Received",
      },
      sendFlow: {
        sending: "Sending...",
        send: "Send",
        enterDetails: "Enter Details",
        availableAmount: "Available:",
        sendUsdt: "Send USDT",
        recipientAddress: "Recipient Address:",
        amount: "Amount:",
        continue: "Continue",
        network: "Network:",
        networkFee: "Network Fee:",
        errorEnterRecipient: "Enter recipient address.",
        errorInvalidRecipient: "$1 is not a valid address.",
        errorEnterAmount: "Enter amount.",
        errorNegativeAmount: "Amount cannot be negative.",
        errorLimitExceeded: "Maximum $1 USDT can be sent.",
        confirmTransfer: "Confirm Transfer",
      },
      receiveWindow: {
        receiveUsdt: "Receive USDT",
        walletQrLabel: "Show this QR code to receive funds",
        yourWalletAddress: "Your wallet address:",
        copyAddress: "Copy address",
        copied: "Copied",
      },
      receiptWindow: {
        receipt: "Receipt",
        sent: "Sent",
        received: "Received",
        senderAddress: "Sender Address:",
        transactionId: "Transaction ID:",
        recipientAddress: "Recipient Address:",
        amount: "Amount:",
        status: "Status:",
        completed: "Completed",
        date: "Date:",
        transferDetails: "Transfer Details",
        viewOnTronscan: "View on Tronscan",
        transferNotFound: "Transfer Not Found",
        whatsNext: "What's next?",
      },
      createWalletFlow: {
        createWallet: "Create Wallet",
        thisIsYourSecretPhrase: "This is your secret phrase. Save it in a secure place.",
        secretPhrase: "Secret Phrase",
        hideSecretPhrase: "Hide Secret Phrase",
        revealSecretPhrase: "Reveal Secret Phrase",
        copySecretPhrase: "Copy Secret Phrase",
        iSaved: "I've saved it",
        word: "Word",
        verifySecretPhrase: "Verify that you saved your secret phrase correctly.",
        confirm: "Confirm",
        introduction: "Introduction",
        introductionLine1: "- Creating a crypto wallet is not as scary as it might sound.",
        introductionLine2: "- We'll help you understand this process.",
        stepsDescriptionTitle: "Right now you will:",
        stepDescription1: "1. Create a new Smooth USDT wallet.",
        stepDescription2: "2. Set up a pin code for your wallet.",
        getStarted: "Get started",
        wordIsIncorrect: "Word #{{index}} is incorrect",
        creating: "Creating...",
        walletSecurityDescription: "Your wallet will be secured by a secret phrase. You will need it to log in on a new device or if you clear your browser cache.",
        whatIsSecretPhraseTitle: "Secret phrase is like a password, but:",
        whatIsSecretPhraseLine1: "- It is not recoverable if you lose it",
        whatIsSecretPhraseLine2: "- It will be generated automatically.",
      },
      importWalletFlow: {
        importWallet: "Import Wallet",
        whenImport: "When you should import a wallet",
        whenImportLine1: "- Import your Smooth USDT wallet on a new device.",
        whenImportLine2: "- Migrate from other wallet (like Trust Wallet, Exodus, TronLink) to Smooth USDT.",
        stepsDescriptionTitle: "Right now you will:",
        stepDescription1: "1. Import your secret phrase.",
        stepDescription2: "2. Set up a pin code for your imported wallet.",
        secretPhraseMustHave12Words: "Secret phrase must consist of 12 words.",
        invalidSecretPhrase: "Invalid secret phrase.",
        enterSecretPhrase: "Enter your secret phrase:",
        import: "Import",
      },
      allSetWindow: {
        allSet: "All set",
        walletReady: "Your Smooth USDT wallet is ready to be used.",
        startUsing: "Start using"
      },
      createPinWindow: {
        createPin: "Create a pin code",
        createPinLine1: "- Your wallet is almost ready. Create a secure pin code for extra protection.",
        createPinLine2: "- If you forget your pin code, you can reset it with a secret phrase.",
        continue: "Continue"
      },
      verifyPinWindow: {
        verifyPin: "Verify your pin code",
        verifyPinDescription: "You will be asked for your pin code every time you log in to Smooth USDT.",
        incorrectPin: "Incorrect pin",
        continue: "Continue"
      },
      pinLoginWindow: {
        yourPinCode: "Your pin code.",
        incorrectPin: "Incorrect pin. You have {{remainingAttempts}} attempts left.",
        logOut: "Log Out",
        forgotPinCode: "Forgot pin code",
        howToReset: "How to reset pin code",
        resetStep1: "1. Log out.",
        resetStep2: "2. Click \"Import Wallet\" and enter your secret phrase.",
        forgotPinCodeQuestion: "Forgot your pin code?"
      }
    },
  },
  ru: {
    translation: {
      welcomeWindow: {
        usdtFeesFeature: "Оплачивайте комиссию сети в USDT, а не в TRX.",
        nonCustodialFeature: "Совместим со всеми биржами и обменниками.",
        securityFeature: "Некастодиальный кошелек. Никакой верификации личности.",
        smoothDescription: "Простой криптокошелек для получения и отправки USDT TRC-20",
        createWallet: "Создать кошелек",
        importWallet: "Импортировать кошелек",
      },
      settingsWindow: {
        settings: "Настройки",
        language: "Язык",
        logOut: "Выйти",
      },
      homeWindow: {
        send: "Отправить",
        receive: "Получить",
        yourBlance: "Ваш баланс",
      },
      historyComponent: {
        recentTransfers: "Последние переводы",
        emptyHistoryPlaceholder: "Здесь будут отображаться ваши переводы.",
        sent: "Отправлено",
        received: "Получено",
      },
      sendFlow: {
        sending: "Отправка...",
        enterDetails: "Введите реквизиты",
        availableAmount: "Доступно:",
        sendUsdt: "Отправить USDT",
        recipientAddress: "Адрес получателя:",
        amount: "Сумма:",
        continue: "Дальше",
        network: "Сеть:",
        networkFee: "Комиссия сети:",
        errorEnterRecipient: "Укажите адрес получателя.",
        errorInvalidRecipient: "$1 это некорректный адрес.",
        errorEnterAmount: "Введите сумму.",
        errorNegativeAmount: "Сумма не может быть отрицательной.",
        errorLimitExceeded: "Максимум $1 USDT может быть отправлено.",
        confirmTransfer: "Подтвердить перевод",
      },
      receiveWindow: {
        receiveUsdt: "Получить USDT",
        walletQrLabel: "Покажите этот QR код для получения средств",
        yourWalletAddress: "Адрес вашего кошелька:",
        copyAddress: "Копировать адрес",
        copied: "Cкопировано",
      },
      receiptWindow: {
        receipt: "Чек",
        sent: "Отправлено",
        received: "Получено",
        senderAddress: "Адрес отправителя:",
        transactionId: "ID транзакции:",
        recipientAddress: "Адрес получателя:",
        amount: "Сумма:",
        status: "Статус:",
        completed: "Исполнено",
        date: "Дата:",
        transferDetails: "Детали перевода",
        viewOnTronscan: "Посмотреть на Tronscan",
        transferNotFound: "Перевод не найден",
        whatsNext: "Что дальше?",
      },
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
