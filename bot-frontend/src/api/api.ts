import { API_ADDRESS, BASIC_HEADERS } from "../const/api";

import { API_METHODS } from "../components/common/enum/api.methods.enum";
import { HOST } from "../components/common/requests/api.requests";

export type Res<P = {}> = { isOk: boolean; error?: string; result?: P };

type FetchOptions = {
  queryParams?: GETOptions;
  body?: any;
  headers?: Record<string, string>; // set custom headers
};
type GETOptions = { [key: string]: any };

export default class Api {
  static get address(): string {
    return process.env.API_URL ?? "/";
  }

  static api(path: string): string {
    return this.address + API_ADDRESS + path;
  }

  private static async setupOkResponse(res: Response, message?: string) {
    let result = undefined;
    try {
      result = await res.json();
    } catch (e) {}

    return {
      isOk: true,
      result,
      message,
    };
  }

  private static async setupErrorResponse(res: Response, message?: string) {
    return {
      isOk: false,
      error: await res.text(),
      message,
    };
  }

  private static async getResult<P>(res: Response): Promise<Res<P>> {
    return res.ok ? this.setupOkResponse(res) : this.setupErrorResponse(res);
  }

  static divideProperties(props: GETOptions, extractArrays = false) {
    return Object.fromEntries(
      Object.entries(props).filter(([, value]) =>
        extractArrays ? Array.isArray(value) : !Array.isArray(value)
      )
    );
  }

  static extractArrayProperties(props: GETOptions) {}

  static formQuery(options: GETOptions = {}) {
    if (!options || !Object.keys(options).length) {
      return "";
    }

    const arrayProperties = this.divideProperties(options, true) as {
      [key: string]: [any];
    };

    if (!Object.keys(arrayProperties).length) {
      return "?" + new URLSearchParams(options);
    }

    const plainProperties = this.divideProperties(options, false);

    const plainParams = new URLSearchParams(plainProperties);

    const arrayQuery = Object.keys(arrayProperties)
      .map((arrayName) =>
        arrayProperties[arrayName].map((value) => `&${arrayName}=${value}`)
      )
      .join("")
      .replace(/,/g, "");

    return `?${plainParams}${arrayQuery}`;
  }

  static async fetch<P>(
    path: string,
    method: API_METHODS,
    options?: FetchOptions
  ): Promise<Res<P>> {
    const { queryParams, body, ...restOptions } = options || {};
    const urlQuery = this.formQuery(queryParams);

    try {
      const res = await fetch(`${HOST}${path}${urlQuery}`, {
        method: method,
        headers: { ...BASIC_HEADERS, "Content-Type": "application/json" },
        body,
        credentials: "include",
        ...restOptions,
      });

      return this.getResult(res);
    } catch (e) {
      return {
        isOk: false,
        error: "" + e,
      };
    }
  }
}
