/**
 * Styled `<a>` tag.
 */
export const Link: React.FC<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
> = (props) => {
  const { children, ...rest } = props;
  return (
    <a
      className="underline underline-offset-4 text-foreground-primary"
      {...rest}
    >
      {children}
    </a>
  );
};
