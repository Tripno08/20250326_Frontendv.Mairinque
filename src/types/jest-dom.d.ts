import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(className: string): R;
      toHaveStyle(css: Record<string, any>): R;
      toBeVisible(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | number | string[]): R;
      toBeChecked(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeEmpty(): R;
      toBeEmptyDOMElement(): R;
      toBeRequired(): R;
      toHaveFocus(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(htmlText: string): R;
    }
  }

  namespace Chai {
    interface Assertion {
      toBeInTheDocument(): Assertion;
      toHaveAttribute(attr: string, value?: string): Assertion;
      toHaveClass(className: string): Assertion;
      toHaveStyle(css: Record<string, any>): Assertion;
      toBeVisible(): Assertion;
      toHaveTextContent(text: string | RegExp): Assertion;
      toHaveValue(value: string | number | string[]): Assertion;
      toBeChecked(): Assertion;
      toBeDisabled(): Assertion;
      toBeEnabled(): Assertion;
      toBeEmpty(): Assertion;
      toBeEmptyDOMElement(): Assertion;
      toBeRequired(): Assertion;
      toHaveFocus(): Assertion;
      toContainElement(element: HTMLElement | null): Assertion;
      toContainHTML(htmlText: string): Assertion;
      toBe(expected: any): Assertion;
      toEqual(expected: any): Assertion;
      toBeNull(): Assertion;
      toBeDefined(): Assertion;
      toBeUndefined(): Assertion;
      toHaveBeenCalledTimes(count: number): Assertion;
      toHaveBeenCalledWith(...args: any[]): Assertion;
    }
  }

  namespace expect {
    function stringContaining(expected: string): any;
    function any(constructor: any): any;
  }
}
