import { HouseholdRepository } from "../repositories/household.repository";

export class HouseholdService {
	constructor(private readonly repo: HouseholdRepository) {}

	async getHousehold() {
		return await this.repo.getCurrent();
	}
}
