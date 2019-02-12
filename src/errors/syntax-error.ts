
function padStart(text: string, length: number) {
  if (text.length > length) {
    return text
  }
  length = length - text.length
  return " ".repeat(length).slice(0, length) + text
}

export class SyntaxError extends Error {

  public readonly code = "SYNTAX_ERROR"

  constructor(source: string, expected: string, received: string, public position: number, public line: number, public column: number) {
    super(`Syntax Error: ${expected ? `expected ${expected}, ` : ""}unexpected token "${received}" (${line}:${column})
${line}: ${source.split("\n")[line - 1]}
${padStart("^", column + 2 + line.toString().length)}`)
    Object.setPrototypeOf(this, SyntaxError.prototype)
  }
}
