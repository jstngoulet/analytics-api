import fetch from "node-fetch";
import HttpRequest from './httpResponse';

export default async function http<T>(request: fetch.RequestInfo): Promise<HttpRequest<T>> {
  const response: HttpRequest<T> = await fetch(request);

  try {
    // may error if there is no body
    response.parsedBody = await response.json();
  } catch (ex) {}

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}
