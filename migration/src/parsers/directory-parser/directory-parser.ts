import { Utilities } from "../../utilities";
import { DataFile } from "./directory-parser.types";

export class DirectoryParser {
  private readonly _utils = Utilities.getInstance();

  public generateDirectoryData(
    path: string,
    excludedFiles: string[]
  ): DataFile[] {
    return this._parseDirectoryFiles(path, excludedFiles);
  }

  private _parseDirectoryFiles(
    path: string,
    excludedFiles: string[]
  ): DataFile[] {
    if (this._utils.files.isDirectory(path)) {
      const contentDirectory = this._utils.files.readDirectory(path) || [];
      const directory = this._utils.common.excludeItemWithPattern(
        contentDirectory,
        excludedFiles
      );
      return this._createDataFileArray(path, directory, excludedFiles);
    }
    return [];
  }

  private _createDataFileArray(
    rootPath: string,
    directoryFiles: string[],
    excludedFiles: string[]
  ): DataFile[] {
    const dataFiles: DataFile[] = [];
    for (const index in directoryFiles) {
      const path = `${rootPath}/${directoryFiles[index]}`;
      this._appendDirectoryToData(path, dataFiles, excludedFiles);
      this._appendFileToData(path, dataFiles);
    }
    return dataFiles;
  }

  private _appendDirectoryToData(
    path: string,
    dataFiles: DataFile[],
    excludedFiles: string[]
  ): void {
    const parsedDirectoryData = this._parseDirectoryFiles(path, excludedFiles);
    dataFiles.push(...parsedDirectoryData);
  }

  private _appendFileToData(path: string, dataFiles: DataFile[]): void {
    const content = this._utils.files.readFile(path);
    if (content) {
      dataFiles.push({ path, content });
    }
  }
}
