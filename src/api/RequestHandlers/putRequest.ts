import fetch from "node-fetch";
import http from "./httpRequest";
import httpResponse from "./httpResponse";

export default async function put<T>(
  path: string,
  body: any,
  args: fetch.RequestInit = { method: "put", body: JSON.stringify(body) }
): Promise<httpResponse<T>> {
  return await http<T>(new fetch.Request(path, args));
}
