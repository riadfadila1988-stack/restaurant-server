"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_controller_1 = __importDefault(require("./employee.controller"));
const router = (0, express_1.Router)();
router.get('/getAll', async (req, res) => await employee_controller_1.default.getAll(req, res));
router.post('/add', async (req, res) => await employee_controller_1.default.create(req, res));
exports.default = router;
