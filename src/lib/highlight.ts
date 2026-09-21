// Tiny TSX tokenizer for the hero code window: just enough for believable highlighting.

export type TokenKind = "kw" | "str" | "comp" | "hook" | "attr" | "punc" | "num" | "plain";
export interface Token { kind: TokenKind; text: string }

const RULES: [TokenKind, RegExp][] = [
  ["str", /^"[^"\n]*"?/],
  ["kw", /^(?:export|function|const|return|import|from|true|false)\b/],
  ["hook", /^use[A-Z]\w*/],
  ["comp", /^[A-Z]\w*/],
  ["num", /^\d+/],
  ["attr", /^[a-z]\w*(?==)/],
  ["punc", /^[<>/{}()[\]=,;.]+/],
  ["plain", /^[^"A-Za-z0-9<>/{}()[\]=,;.]+|^\w+/],
];

export function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let rest = src;
  while (rest.length) {
    let matched = false;
    for (const [kind, re] of RULES) {
      const m = re.exec(rest);
      if (m && m[0].length) {
        out.push({ kind, text: m[0] });
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      out.push({ kind: "plain", text: rest[0]! });
      rest = rest.slice(1);
    }
  }
  return out;
}

/** The first `chars` characters of a token list, splitting the last token if needed. */
export function sliceTokens(tokens: Token[], chars: number): Token[] {
  const out: Token[] = [];
  let left = chars;
  for (const t of tokens) {
    if (left <= 0) break;
    out.push(t.text.length <= left ? t : { kind: t.kind, text: t.text.slice(0, left) });
    left -= t.text.length;
  }
  return out;
}
