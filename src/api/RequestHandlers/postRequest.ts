import fetch from "node-fetch";
import http from "./httpRequest";
import httpResponse from "./httpResponse";

export default async function post<T>(
  path: string,
  body: any,
  args: fetch.RequestInit = { method: "post", body: JSON.stringify(body) }
): Promise<httpResponse<T>> {
  return await http<T>(new fetch.Request(path, args));
};