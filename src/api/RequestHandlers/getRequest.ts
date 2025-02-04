import fetch from "node-fetch";
import http from './httpRequest';
import httpResponse from './httpResponse';

export default async function get<T>(
  path: string,
  args: fetch.RequestInit = { method: "get" }
): Promise<httpResponse<T>> {
  return await http<T>(new fetch.Request(path, args));
}
