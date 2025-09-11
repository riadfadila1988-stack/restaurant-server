"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const restaurant_controller_1 = __importDefault(require("./restaurant.controller"));
const apiKeyAuth_1 = require("../../core/middlewares/apiKeyAuth");
const router = (0, express_1.Router)();
// Public registration endpoint
router.post('/register', (req, res) => restaurant_controller_1.default.register(req, res));
// Authenticated endpoint to fetch current restaurant by apiKey
router.get('/me', apiKeyAuth_1.apiKeyAuth, (req, res) => restaurant_controller_1.default.me(req, res));
exports.default = router;
