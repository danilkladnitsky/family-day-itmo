import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Form } from 'src/entities/forms.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Form) private readonly formRepository: Repository<Form>,
  ) {}

  async getUser(value: string, property = 'userId') {
    return this.userRepository.findOne({ [property]: value });
  }

  async createUser(user: User) {
    return await this.userRepository.save(user);
  }

  async getFormById(userId: string) {
    return await this.formRepository.findOne({ userId });
  }

  async getFormByUserId(userId: string) {
    return await this.formRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.user', 'user')
      .where(`user.userId = :userId`, { userId })
      .getOne();
  }

  async saveForm(form: Partial<Form>) {
    const existingForm = await this.getFormById(form.userId);

    if (existingForm) {
      const hobies = existingForm.hobies
        ? (existingForm.hobies ?? '') + ',' + form.hobies
        : form.hobies;

      const object = {
        ...existingForm,
        ...form,
        hobies,
      };
      return await this.formRepository.save(object);
    }

    return await this.formRepository.save(form);
  }
}
