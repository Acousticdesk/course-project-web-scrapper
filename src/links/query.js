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
exports.queryLinks = void 0;
function queryLinks(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const grid = yield page.$("#search-results > .UIGrid");
        return yield (grid === null || grid === void 0 ? void 0 : grid.evaluate((gridElement) => {
            const cards = [...gridElement.querySelectorAll(".Card")];
            return cards.map((card) => {
                var _a, _b;
                const title = (_a = card.querySelector(".Card-title > h5")) === null || _a === void 0 ? void 0 : _a.textContent;
                const link = (_b = card
                    .querySelector(".Card-link")) === null || _b === void 0 ? void 0 : _b.getAttribute("href");
                return {
                    title,
                    link,
                };
            });
        }));
    });
}
exports.queryLinks = queryLinks;
