export async function verifyTurnstile(
  token: string,
  secret: string,
  options?: { debug: boolean },
) {
  const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ response: token, secret }),
  });
  const result = await response.json();
  if (options?.debug) {
    console.log("Turnstile Response: ", result);
  }
  return result.success;
}
