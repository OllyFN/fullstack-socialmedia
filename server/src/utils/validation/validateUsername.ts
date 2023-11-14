const disallowedChars = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "+",
  "=",
  "<",
  ">",
  "?",
  "/",
  "\\",
  "|",
  "[",
  "]",
  "{",
  "}",
  "`",
  "~",
];

const nameLengthRange = [3, 20]; // [min, max]

export default (username: string) =>
  username.length >= nameLengthRange[0] &&
  username.length <= nameLengthRange[1] &&
  !disallowedChars.some((char) => username.includes(char)) &&
  !username.includes(" ");
