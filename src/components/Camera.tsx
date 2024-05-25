import { IScannerProps, Scanner } from "@yudiel/react-qr-scanner";

export const Camera = (props: { onScan: IScannerProps["onScan"] }) => {
  return <Scanner allowMultiple={false} onScan={props.onScan} />;
};
