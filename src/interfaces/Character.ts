export interface Character {
  id: number;
  name: string;
  thumbnail: {
    path: string;
    extension: string;
  };
}

export interface CharacterSection {
  title: string;
  data: Character[];
}
