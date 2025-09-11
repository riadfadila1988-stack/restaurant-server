import {Material} from "./material.model";
import {MaterialDocument} from "./material.interface";
import {Types} from "mongoose";

class MaterialService {
    async findAll(restaurantId: string): Promise<MaterialDocument[]> {
        return await Material.find({ restaurantId });
    }

    async findOne(id: string, restaurantId: string): Promise<MaterialDocument> {
        const material = await Material.findOne({ _id: id, restaurantId });
        if (!material) {
            throw new Error('No material found.');
        }
        return material;

    }

    async add(material: MaterialDocument, restaurantId: string): Promise<MaterialDocument> {
        return await Material.create({ ...material, restaurantId, _id: undefined });
    }

    async update(id: string, material: MaterialDocument, restaurantId: string): Promise<MaterialDocument> {
        const updatedMaterial = await Material.findOneAndUpdate(
            { _id: id, restaurantId },
            { ...material, restaurantId },
            { new: true }
        );
        if (!updatedMaterial) {
            throw new Error('No material found.');
        }
        return updatedMaterial;
    }

    async decreaseIngredients(
        ingredients: { materialId: Types.ObjectId; amount: number }[]
    ) {
        return Promise.all(
            ingredients.map((ing) =>
                Material.findByIdAndUpdate(
                    ing.materialId,
                    { $inc: { quantity: -ing.amount } },
                    { new: true }
                ).then((res) => {
                    if (!res) {
                        console.warn("Material not found:", ing.materialId);
                    } else {
                        console.log(`Updated ${res.name}, new qty: ${res.quantity}`);
                    }
                })
            )
        );
    }

    async increaseIngredients(
        ingredients: { materialId: Types.ObjectId; amount: number }[]
    ) {
        return Promise.all(
            ingredients.map((ing) =>
                Material.findByIdAndUpdate(
                    ing.materialId,
                    { $inc: { quantity: ing.amount } }, // Use positive amount to increase
                    { new: true }
                ).then((res) => {
                    if (!res) {
                        console.warn("Material not found for return:", ing.materialId);
                    } else {
                        console.log(`Returned ${res.name}, new qty: ${res.quantity}`);
                    }
                })
            )
        );
    }
}

export default new MaterialService();