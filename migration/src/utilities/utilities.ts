import { CommonUtilities } from "./common-utilities";
import { FileUtilities } from "./file-utilities";

export class Utilities {
  private static instance: Utilities;

  public readonly commonUtilites: CommonUtilities;

  public readonly fileUtilities: FileUtilities;

  private constructor() {
    this.commonUtilites = new CommonUtilities();
    this.fileUtilities = new FileUtilities(this.commonUtilites);
  }

  public static getInstance(): Utilities {
    if (!Utilities.instance) {
      Utilities.instance = new Utilities();
    }
    return Utilities.instance;
  }
}
