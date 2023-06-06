import { Test } from "./test";

export class Test2 {
  private variableOne: string;

  public variabletwo: number;

  public variablethree: Observable<number>;

  constructor(private _test: Test) {}

  public onMethodOne(numericValue: number): string {
    return numericValue + "";
  }
}

export class Observable<T> {
  subscribe(): void {}
}

export interface IApi {
  doRequest(url: string): Observable<void>
}

export interface IApi2 {}

export interface IApi3 {}

export class Sandbox {}

export abstract class Api implements IApi, IApi2, IApi3 {
  doRequest(url: string): Observable<void> {
    throw new Error("Method not implemented.");
  }
}

export class ApiConcrete extends Api{

}

export abstract class Facade {
  abstract onGeolocationOpen(): void;

  constructor(public sandbox: Sandbox, private _api: Api) {}
}

export abstract class LocationFacade extends Facade {
  private _isLocation(event: Event): Observable<boolean> {
    return null as never;
  }

  public requestLocation(param: Observable<number>): Observable<Observable<number>> {
    return null as never;
  }
}

export class LocationPageFacade extends LocationFacade {
  public onGeolocationOpen(): void {}
}
