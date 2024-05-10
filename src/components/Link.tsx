import styled from "styled-components";

/**
 * Just the Vite link styles as a sc.
 */
export const Link = styled.a`
  font-weight: 500;
  color: var(--theme-color);
  text-decoration: inherit;

  &:hover {
    color: #535bf2;
  }

  @media (prefers-color-scheme: light) {
    &:hover {
      color: #747bff;
    }
  }
`;
