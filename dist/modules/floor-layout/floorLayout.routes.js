"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const floorLayout_controller_1 = __importDefault(require("./floorLayout.controller"));
const router = (0, express_1.Router)();
router.get('/getAll', async (req, res) => await floorLayout_controller_1.default.getAllLayouts(req, res));
router.post('/new-layout', async (req, res) => await floorLayout_controller_1.default.addNewLayout(req, res));
router.get('/getCurrent', async (req, res) => await floorLayout_controller_1.default.getCurrentLayout(req, res));
router.put('/setCurrent/:layoutId', async (req, res) => await floorLayout_controller_1.default.setCurrentLayout(req, res));
exports.default = router;
