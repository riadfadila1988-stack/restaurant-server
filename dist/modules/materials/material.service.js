"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_module_1 = require("./material.module");
class MaterialService {
    async findAll() {
        return await material_module_1.Material.find();
    }
    async findOne(id) {
        const material = await material_module_1.Material.findById(id);
        if (!material) {
            throw new Error('No material found.');
        }
        return material;
    }
    async add(material) {
        return await material_module_1.Material.create(material);
    }
    async update(id, material) {
        const updatedMaterial = await material_module_1.Material.findByIdAndUpdate(id, material, { new: true });
        if (!updatedMaterial) {
            throw new Error('No material found.');
        }
        return updatedMaterial;
    }
    async decreaseIngredients(ingredients) {
        return Promise.all(ingredients.map((ing) => material_module_1.Material.findByIdAndUpdate(ing.materialId, { $inc: { quantity: -ing.amount } }, { new: true }).then((res) => {
            if (!res) {
                console.warn("Material not found:", ing.materialId);
            }
            else {
                console.log(`Updated ${res.name}, new qty: ${res.quantity}`);
            }
        })));
    }
}
exports.default = new MaterialService();
