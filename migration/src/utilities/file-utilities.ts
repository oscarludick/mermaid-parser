import * as fs from "fs";
import { CommonUtilities } from "./common-utilities";

export class FileUtilities {
  constructor(private readonly _commonUtilities: CommonUtilities) {}

  public readDirectory(path: string): string[] | null {
    return this._commonUtilities.tryNullOnError(() => fs.readdirSync(path));
  }

  public readFile(path: string, encode = "utf8"): string | null {
    const encoding = encode as never as null; //fix typing bug
    return this._commonUtilities.tryNullOnError(
      () => fs.readFileSync(path, { encoding }) as never as string
    );
  }

  public writeFile(path: string, content: string): void | null {
    return this._commonUtilities.tryNullOnError(() =>
      fs.writeFileSync(path, content)
    );
  }

  public isDirectory(path: string): boolean | null {
    return this._commonUtilities.tryNullOnError(() =>
      fs.lstatSync(path).isDirectory()
    );
  }
}
