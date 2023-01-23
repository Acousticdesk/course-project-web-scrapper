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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const fs_1 = require("fs");
dotenv.config();
const puppeteer_1 = require("puppeteer");
const query_1 = require("@/links/query");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        dumpio: true,
    });
    const page = yield browser.newPage();
    yield page.goto(process.env.WEBSITE);
    yield page.waitForSelector("#search-results");
    fs_1.default.writeFileSync("links.json", JSON.stringify(yield (0, query_1.queryLinks)(page), null, 2));
    yield browser.close();
}))();
