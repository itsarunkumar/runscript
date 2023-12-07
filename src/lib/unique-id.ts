class AlphanumericUuidGenerator {
  private characters: string;
  private charactersLength: number;
  private seededRandom?: () => number;

  constructor(private length: number, private rngSeed?: number) {
    if (length <= 0) {
      throw new Error("Length must be greater than 0");
    }

    this.characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    this.charactersLength = this.characters.length;

    if (this.rngSeed !== undefined) {
      // If a seed is provided, use a seeded random number generator
      // This example uses a simple linear congruential generator (LCG)
      const lcg = (seed: number) => () =>
        (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
      this.seededRandom = lcg(this.rngSeed);
    }
  }

  generateUniqueId(): string {
    if (this.seededRandom !== undefined) {
      return Array.from({ length: this.length }, () =>
        this.characters.charAt(
          // @ts-ignore
          Math.floor(this.seededRandom() * this.charactersLength)
        )
      ).join("");
    }

    // Use the default Math.random() if no seed is provided
    return Array.from({ length: this.length }, () =>
      this.characters.charAt(Math.floor(Math.random() * this.charactersLength))
    ).join("");
  }
}

export const idGenerator = new AlphanumericUuidGenerator(15, 12345);
