import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

interface CheckAgePipeOptions {
  minAge: number;
}

@Injectable()
export class CheckAgePipe implements PipeTransform {
  constructor(private options: CheckAgePipeOptions) {}
  transform(value: string, metadata: ArgumentMetadata): number {
    const age = Number(value);
    if (Number.isNaN(age) || age < this.options.minAge) {
      throw new BadRequestException(
        `Age must be numeric string and greater than ${this.options.minAge}`,
      );
    }
    return Number(age);
  }
}
