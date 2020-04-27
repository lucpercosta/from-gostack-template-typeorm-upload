import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (type === 'income' || type === 'outcome') {
      const balance = await transactionRepository.getBalance();

      if (value > balance.total && type === 'outcome') {
        throw new AppError(
          'Error The withdrawal amount is greater than the account balance',
        );
      } else {
        const categoryRepository = getRepository(Category);

        let findCategoryExists = await categoryRepository.findOne({
          where: { title: category },
        });

        if (!findCategoryExists) {
          findCategoryExists = categoryRepository.create({
            title: category,
          });
          await categoryRepository.save(findCategoryExists);
        }

        const transaction = transactionRepository.create({
          title,
          value,
          type,
          category: findCategoryExists,
        });

        await transactionRepository.save(transaction);
        return transaction;
      }
    }
    throw new AppError('Error type need income or outcome');
  }
}

export default CreateTransactionService;
