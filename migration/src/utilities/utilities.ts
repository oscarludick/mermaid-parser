import { CommonUtilities } from "./common-utilities";
import { FileUtilities } from "./file-utilities";

export class Utilities {
  private static instance: Utilities;

  public readonly common: CommonUtilities;

  public readonly files: FileUtilities;

  private constructor() {
    this.common = new CommonUtilities();
    this.files = new FileUtilities(this.common);
  }

  public static getInstance(): Utilities {
    if (!Utilities.instance) {
      Utilities.instance = new Utilities();
    }
    return Utilities.instance;
  }
}
