
import {
  component$,
  PropsOf,
  type QRL,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

export type UseTurnstileProps = {
  siteKey: string;
  onTokenResponse$?: QRL<(token: string) => void>;
};

export function useTurnstile({ siteKey, onTokenResponse$ }: UseTurnstileProps) {
  const tokenSignal = useSignal("");

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const turnstileScript = document.createElement("script");
    turnstileScript.setAttribute(
      "src",
      "https://challenges.cloudflare.com/turnstile/v0/api.js",
    );
    const valueMutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "value") {
          if (onTokenResponse$) {
            onTokenResponse$((mutation.target as HTMLInputElement).value);
          }
          tokenSignal.value = (mutation.target as HTMLInputElement).value;
        }
      });
    });

    const classMutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const node = mutation.target;
          if (
            node instanceof HTMLElement &&
            node.classList.contains("cf-turnstile")
          ) {
            const inputElement = node.querySelector(
              '[name="cf-turnstile-response"]',
            );
            if (inputElement) {
              valueMutationObserver.observe(inputElement, {
                attributes: true,
              });
              classMutationObserver.disconnect();
            }
          }
        }
      });
    });

    classMutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    document.body.append(turnstileScript);

    cleanup(() => {
      valueMutationObserver.disconnect();
    });
  });

  const Turnstile = component$((props: PropsOf<'div'>) => (
    <div {...props} class="cf-turnstile" data-sitekey={siteKey}></div>
  ));

  return {
    tokenSignal,
    Turnstile,
  };
}