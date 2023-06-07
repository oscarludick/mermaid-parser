import { ClassParser } from "./parsers/class-parser";
import { DirectoryParser } from "./parsers/directory-parser";

export class MermaidParser {
  private _directoryParser: DirectoryParser;

  private _classParser: ClassParser;

  constructor(private _path: string, private _exclude: string[]) {
    this._directoryParser = new DirectoryParser();
    this._classParser = new ClassParser();
  }

  public parse(): void {
    const files = this._getFilesContent();
    const classData = this._classParser.generateClassData(files);
  }

  private _getFilesContent(): string[] {
    return this._directoryParser
      .generateDirectoryData(this._path, this._exclude)
      .map((data) => data.content);
  }
}

const path = ".";
const exclude = [
  "*.js",
  "*.json",
  "node_modules",
  ".gitignore",
  ".git",
  "*.md",
];

const mermaidParser = new MermaidParser(path, exclude);
mermaidParser.parse();
