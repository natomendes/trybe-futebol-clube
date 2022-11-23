export interface TokenGenerator {
  generate(email: string): string
}
