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
    const userExists = await this.getUser(user.userId);
    return userExists ?? (await this.userRepository.save(user));
  }

  async updateFeedback(userId: string, feedback: string) {
    const user = await this.getUser(userId);

    return user ? await this.userRepository.update(userId, { feedback }) : null;
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

  async getForms() {
    return await this.formRepository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.user', 'user')
      .getMany();
  }

  async saveForm(form: Partial<Form>) {
    const existingForm = await this.getFormById(form.userId);

    if (existingForm) {
      const newHobies = (existingForm.hobies ?? '') + ',' + form.hobies;
      const hobies = Boolean(existingForm.hobies) ? newHobies : form.hobies;

      const object = {
        ...existingForm,
        ...form,
        hobies,
      };
      return await this.formRepository.save(object);
    }

    return await this.formRepository.save(form);
  }

  async findForm(userId: string) {
    const form = await this.getFormById(userId);

    const userMetrics = form.hobies.split(',');
    const forms = await this.getForms();

    forms.forEach((form) => {
      const metrics = form.hobies.split(',');
    });
  }

  async countMatches(userMetric: string, currentMetric: string) {
    const userMetrics = userMetric.split(',');
    const currentMetrics = currentMetric.split(',');

    if (!userMetrics.length || !currentMetrics) {
      return 0;
    }

    let counter = 0;

    currentMetrics.forEach((metric) => {
      if (userMetrics.indexOf(metric) !== -1) {
        counter++;
      }
    });

    return counter;
  }
}
