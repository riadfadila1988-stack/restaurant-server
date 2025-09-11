"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_controller_1 = __importDefault(require("./categories.controller"));
const router = (0, express_1.Router)();
router.get('/getAll', async (req, res) => await categories_controller_1.default.getAllCategories(req, res));
router.post('/addCategory', async (req, res) => await categories_controller_1.default.addCategory(req, res));
router.put('/updateCategory/:id', async (req, res) => await categories_controller_1.default.updateCategory(req, res));
router.get('/categoriesFoods', async (req, res) => await categories_controller_1.default.getCategoriesFoods(req, res));
exports.default = router;
