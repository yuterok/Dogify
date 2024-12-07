export interface IBreed {
  weight: { metric: string };
  name: string;
  temperament?: string;
}

export interface IDog {
  breeds: IBreed[];
  id: string;
  url: string;
}
