"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRequest = exports.putRequest = exports.getRequest = void 0;
const getRequest_1 = __importDefault(require("./getRequest"));
exports.getRequest = getRequest_1.default;
const postRequest_1 = __importDefault(require("./postRequest"));
exports.postRequest = postRequest_1.default;
const putRequest_1 = __importDefault(require("./putRequest"));
exports.putRequest = putRequest_1.default;
/**
 * Sample Request:
 *
    import { getRequest, postRequest } from './api/RequestHandlers';
 *
 *   try {
        const response = await postRequest<{ id: number }>(
        "https://jsonplaceholder.typicode.com/posts",
        { title: "my post", body: "some content" }
        );
        res.status(200).json(response.parsedBody);
    } catch (err) {
        console.log('error: ${err}');;
        res.status(401).json(err);
    }
 */ 
