import { useAnimate } from "framer-motion";
import { useState } from "react";
import { Page, PageContent, PageHeader } from "./Page";
import { DeleteIcon, DotIcon, Loader2 } from "lucide-react";

function PinButton(props: {
  children: any;
  onClick: () => void;
  disabled: boolean;
}) {
  const [highlighterScope, highliterAnimate] = useAnimate();

  const onClick = async () => {
    if (props.disabled) return;

    props.onClick();
    await highliterAnimate(
      highlighterScope.current,
      {
        opacity: 0.15,
        innerWidth: 100,
        innerHeight: 100,
      },
      {
        duration: 0.3,
      },
    );
    await highliterAnimate(
      highlighterScope.current,
      {
        opacity: 0,
      },
      {
        duration: 0.3,
      },
    );
  };

  return (
    <div
      className="relative p-6 flex justify-center items-center"
      onClick={onClick}
      style={{
        opacity: props.disabled ? 0.5 : 1,
      }}
    >
      <div
        ref={highlighterScope}
        className="absolute w-16 h-16 rounded-full bg-current opacity-0"
      />
      {props.children}
    </div>
  );
}

function DigitButton(props: {
  value: number;
  onClick: (arg0: number) => void;
  disabled: boolean;
}) {
  return (
    <PinButton
      onClick={() => props.onClick(props.value)}
      disabled={props.disabled}
    >
      <p className="text-xl font-bold">{props.value}</p>
    </PinButton>
  );
}

function BackspaceButton(props: { onClick: () => void; disabled: boolean }) {
  return (
    <PinButton onClick={props.onClick} disabled={props.disabled}>
      <DeleteIcon />
    </PinButton>
  );
}

function DigitWindow(props: { filled: boolean }) {
  return (
    <div className="relative w-8 h-full flex justify-center items-center">
      {/* A separate div to have the border transparent while keeping the dot non-transparent */}
      <div className="absolute w-full h-full border-current border-2 rounded-lg opacity-15"></div>
      <DotIcon
        className="absolute"
        size={64}
        visibility={props.filled ? "auto" : "hidden"}
      />
    </div>
  );
}

export function PinInput() {
  const pinDigits = 6;
  const [pin, setPin] = useState("");
  const [pinFieldDisabled, setPinFieldDisabled] = useState(false);

  // animation
  const [pinWindowScope, pinWindowAnimate] = useAnimate();
  const [loaderScope, loaderAnimate] = useAnimate();

  const verifyPinCode = async () => {
    setPinFieldDisabled(true);
    await Promise.all([
      pinWindowAnimate(pinWindowScope.current, {
        width: 0,
        opacity: 0,
      }),
      loaderAnimate(
        loaderScope.current,
        {
          opacity: 1,
        },
        {
          delay: 0.25,
        },
      ),
    ]);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    setPinFieldDisabled(false);
  };

  const addDigit = (pressedValue: number) => {
    const newPin = pin + pressedValue.toString();
    setPin(newPin);
    if (newPin.length >= pinDigits) verifyPinCode();
  };

  const removeDigit = () => {
    if (pin.length === 0) return;
    setPin(pin.substring(0, pin.length - 1));
  };

  const digitWindows = [];
  for (let i = 0; i < pinDigits; i++) {
    digitWindows.push(<DigitWindow key={i} filled={pin.length >= i + 1} />);
  }

  return (
    <Page>
      <PageHeader>
        <span>
          smooth <span className="text-xs text-muted-foreground"> USDT</span>
        </span>
      </PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-between">
          <div className="h-full flex flex-col justify-center items-center gap-8">
            <p className="text-center text-xl">Enter pin code</p>
            <div className="relative w-full h-10 flex justify-center">
              <div
                ref={pinWindowScope}
                className="h-full flex justify-center gap-4"
              >
                {digitWindows}
              </div>
              <div className="absolute top-0 w-full h-full flex flex-col justify-center items-center">
                <Loader2
                  ref={loaderScope}
                  style={{ opacity: 0 }}
                  className="h-4 w-4 animate-spin"
                />
              </div>
            </div>
            <p className="max-w-72 text-center text-sm opacity-50">
              Pin code adds an extra layer of security when using the app
            </p>
          </div>
          <div className="grid grid-cols-3">
            <DigitButton
              value={1}
              onClick={addDigit}
              disabled={pinFieldDisabled}
            />
            <DigitButton
              value={2}
              onClick={addDigit}
              disabled={pinFieldDisabled}
            />
            <DigitButton
              value={3}
              onClick={addDigit}
              disabled={pinFieldDisabled}
            />
            <DigitButton
              value={4}
              onClick={addDigit}
              disabled={pinFieldDisabled}
            />
            <DigitButton
              value={5}
              onClick={addDigit}
              disabled={pinFieldDisabled}
            />
            <DigitButton
              value={6}
              onClick={addDigit}
              disabled={pinFieldDisabled}
            />
            <DigitButton
              value={7}
              onClick={addDigit}
              disabled={pinFieldDisabled}
            />
            <DigitButton
              value={8}
              onClick={addDigit}
              disabled={pinFieldDisabled}
            />
            <DigitButton
              value={9}
              onClick={addDigit}
              disabled={pinFieldDisabled}
            />
            <div />
            <DigitButton
              value={0}
              onClick={addDigit}
              disabled={pinFieldDisabled}
            />
            <BackspaceButton
              onClick={removeDigit}
              disabled={pinFieldDisabled}
            />
          </div>
        </div>
      </PageContent>
    </Page>
  );
}
