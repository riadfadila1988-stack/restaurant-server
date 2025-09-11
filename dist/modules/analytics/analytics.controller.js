"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = void 0;
const analytics_service_1 = __importDefault(require("./analytics.service"));
const getSummary = async (req, res) => {
    try {
        const { from, to } = req.query;
        const summary = await analytics_service_1.default.getSummary(from, to);
        res.json(summary);
    }
    catch (e) {
        console.error("Analytics summary failed", e);
        res.status(500).json({ message: "Failed to get analytics summary" });
    }
};
exports.getSummary = getSummary;
