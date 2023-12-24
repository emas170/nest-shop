export interface MulterDiskUploadedFiles {
  [fieldname: string]:
    | {
        filename: string;
        size: number;
        mimetype: string;
        original: string;
        encoding: string;
      }[]
    | undefined;
}
