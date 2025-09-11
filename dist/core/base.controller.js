"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    handleSuccess(res, data, statusCode = 200) {
        console.log(data);
        res.status(statusCode).json(data);
    }
    handleError(res, message, statusCode = 500) {
        console.log(message);
        res.status(statusCode).json({ error: message });
    }
}
exports.default = BaseController;
