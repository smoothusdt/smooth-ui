import styled from "styled-components";

/**
 * Just the Vite button styles as a sc.
 */
export const Button = styled.button`
  border-radius: 4px;
  border: 1px solid transparent;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
  transition: filter 300ms;
  will-change: filter;
  line-height: 48px;
  padding: 0 24px;

  &:disabled {
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: var(--theme-color);
    filter: drop-shadow(0 0 1em #646cffaa);
  }

  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  @media (prefers-color-scheme: light) {
    background-color: #f9f9f9;
  }
`;
