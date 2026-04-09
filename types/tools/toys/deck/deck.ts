export type DeckCard = {
  name: string;
  tag: string;
  description: string;
};

export type DeckEditingCard = DeckCard & { quantity: number; hide: boolean };

export enum DeckAreaType {
  FIELD = "field",
  DECK = "deck",
  DISCARD = "discard",
  HAND = "hand",
}
