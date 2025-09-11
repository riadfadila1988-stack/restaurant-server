"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const food_controller_1 = __importDefault(require("./food.controller"));
const router = (0, express_1.Router)();
router.post('/add', async (req, res) => await food_controller_1.default.addFood(req, res));
router.get('/get-food/:id', async (req, res) => await food_controller_1.default.getFoodById(req, res));
router.get('/category/:id', async (req, res) => await food_controller_1.default.getFoodsByCategoryId(req, res));
router.put('/update/:id', async (req, res) => await food_controller_1.default.updateFood(req, res));
exports.default = router;
