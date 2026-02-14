import type { CategoryRepository } from "../repositories/category.repository";

export class CategoryService {
	constructor(private readonly repo: CategoryRepository) {}

	async getCategoryById(id: string) {
		const data = await this.repo.selectById(id);

		if (!data) return null;

		return {
			...data,
			createdAt: new Date(data.createdAt),
		};
	}

	async getCategories() {
		const categories = await this.repo.select();

		return categories.map((category) => ({
			...category,
			createdAt: new Date(category.createdAt),
			isPersonal: category.scope === "personal",
		}));
	}

	async addCategory(name: string, scope: Scope, householdId: string) {
		if (!name.trim()) {
			throw createError({
				statusCode: 400,
				statusMessage: "Category name is required",
			});
		}

		if (!["personal", "shared"].includes(scope)) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid scope",
			});
		}

		await this.repo.insert(name, scope, householdId);
	}

	async deleteCategory(id: string): Promise<void> {
		await this.repo.delete(id);
	}
}
