export type ID = string | number;

export default abstract class Entity {
  id?: ID;

  constructor({
    id
  }: {
    id?: ID
  }) {
    this.id = id;
  }
}