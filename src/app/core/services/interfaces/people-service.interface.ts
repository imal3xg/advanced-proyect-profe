// src/app/services/interfaces/people.service.interface.ts
import { Person } from '../../models/person.model';
import { IBaseService } from './base-service.interface';

export interface IPeopleService extends IBaseService<Person> {
  // Métodos específicos si los hay
}
