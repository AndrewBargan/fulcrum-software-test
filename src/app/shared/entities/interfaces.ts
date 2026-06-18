export interface IBook {
  id: string;
  author: string;
  title: string;
  pages: number;
}

export type IBookFromXml = {
  [K in keyof IBook]: { _text: string };
};

export interface IImportBooksResult {
  importedCount?: number;
  skippedCount?: number;
  wrongXmlFileFormat?: boolean;
  unsupportedBrowser?: boolean;
  importCanceled?: boolean;
}
