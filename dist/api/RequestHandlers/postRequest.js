"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = post;
const node_fetch_1 = __importDefault(require("node-fetch"));
const httpRequest_1 = __importDefault(require("./httpRequest"));
function post(path_1, body_1) {
    return __awaiter(this, arguments, void 0, function* (path, body, args = { method: "post", body: JSON.stringify(body) }) {
        return yield (0, httpRequest_1.default)(new node_fetch_1.default.Request(path, args));
    });
}
;
