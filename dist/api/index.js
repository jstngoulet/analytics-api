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
