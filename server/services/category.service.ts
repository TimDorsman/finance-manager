import { CategoryRepository } from "~/server/repositories/category.repository";

export class CategoryService {
	constructor(private readonly repo: CategoryRepository) {}

	async getCategoryById(id: string) {
		const data = await this.repo.selectCategoryById(id);

		if (!data) return null;

		return {
			...data,
			createdAt: new Date(data.createdAt),
		};
	}

	async getCategories() {
		const categories = await this.repo.selectCategories();

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

		await this.repo.insertCategory(name, scope, householdId);
	}

	async deleteCategory(id: string): Promise<void> {
		await this.repo.deleteCategoryById(id);
	}
}
