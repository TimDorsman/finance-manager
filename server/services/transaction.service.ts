import { TransactionRepository } from "~/server/repositories/transaction.repository";

export interface CreateTransactionDTO {
	amount: number;
	categoryId: string;
	date: string;
	description: string;
	householdId: string;
	userId: string;
}

export class TransactionService {
	constructor(private readonly repo: TransactionRepository) {}

	async addTransaction(input: CreateTransactionDTO) {
		this.validateTransaction(input);

		return await this.repo.insert(input);
	}

	async getTransactions(
		options: { categoryId?: string; month?: string } = {},
	) {
		return await this.repo.select(options);
	}

	async deleteTransaction(transactionId: string) {
		if (!transactionId) {
			throw new Error("TransactionId is required");
		}

		return await this.repo.deleteById(transactionId);
	}

	private validateTransaction(input: CreateTransactionDTO) {
		if (input.amount <= 0) {
			throw new Error("Amount must be positive");
		}

		if (!input.description?.trim()) {
			throw new Error("Description is required");
		}

		if (Number.isNaN(Date.parse(input.date))) {
			throw new Error("Invalid date");
		}

		if (!input.categoryId) {
			throw new Error("CategoryId is required");
		}

		if (!input.householdId) {
			throw new Error("HouseholdId is required");
		}

		if (!input.userId) {
			throw new Error("UserId is required");
		}
	}
}
