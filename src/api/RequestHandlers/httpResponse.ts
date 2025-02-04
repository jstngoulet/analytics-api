import fetch from "node-fetch";

export default interface HttpResponse<T> extends fetch.Response {
  parsedBody?: T;
}
