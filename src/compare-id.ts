export type WithId = {
  id: string;
};

export const compareId = (a: WithId, b: WithId): number =>
  a.id.localeCompare(b.id);
