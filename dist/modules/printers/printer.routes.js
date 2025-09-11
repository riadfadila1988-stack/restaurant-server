"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const printer_controller_1 = __importDefault(require("./printer.controller"));
const router = (0, express_1.Router)();
router.get('/getAll', async (req, res) => await printer_controller_1.default.getAll(req, res));
router.post('/add', async (req, res) => await printer_controller_1.default.create(req, res));
router.put('/update/:id', async (req, res) => await printer_controller_1.default.update(req, res));
router.delete('/delete/:id', async (req, res) => await printer_controller_1.default.delete(req, res));
router.post('/print', async (req, res) => await printer_controller_1.default.print(req, res));
exports.default = router;
