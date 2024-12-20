export interface Comic {
  id: number;
  title: string;
  resourceURI: string;
  thumbnail: {
    path: string;
    extension: string;
  };
}
