import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Person } from "../../models/person.model";

export interface GroupRaw{
    data: Data<GroupAttributes>
}

export interface PersonRaw {
    data: Data<PersonAttributes>
    meta: Meta
  }
  
export interface Data<T> {
    id: number
    attributes: PersonAttributes
}
export interface PersonData {
    data: PersonAttributes;
}

export interface PersonAttributes {
    name: string
    surname: string
    gender: string
    birthdate: string
    email: string
    createdAt?: string
    updatedAt?: string
    publishedAt?: string
    group:GroupRaw | number | null
}

export interface GroupAttributes {
    name: string
}

export interface Meta {}

@Injectable({
    providedIn: 'root'
  })
  export class PeopleMappingStrapiService implements IBaseMapping<Person> {
    toGenderMapping:any = {
        Masculino:'male',
        Femenino:'female',
        Otros:'other'
    };
    
    fromGenderMapping:any = {
        male:'Masculino',
        female:'Femenino',
        other:'Otros'
    };

    setAdd(data: Person):PersonData {
        return {
            data:{
                name:data.name,
                surname:data.surname,
                email:data.email,
                birthdate:data.birthdate,
                gender: this.toGenderMapping[data.gender],
                group:Number(data.groupId)??null

            }
        };
    }
    setUpdate(data: Person):PersonData {
        let toReturn:any = {
            data: {}
        };  
        Object.keys(data).forEach(key=>{
            switch(key){
                case 'name': toReturn.data['name']=data[key];
                break;
                case 'surname': toReturn.data['surname']=data[key];
                break;
                case 'email': toReturn.data['email']=data[key];
                break;
                case 'birthdate': toReturn.data['birthdate']=data[key];
                break;
                case 'gender': toReturn.data['gender']=data[key]=='Masculino'?'male':data[key]=='Femenino'?'female':'other';
                break;
                case 'groupId': toReturn.data['group']=Number(data[key])??null;
                break;
                default:
            }
        });
        console.log(toReturn)
        return toReturn;
    }
    
    getPaginated(page: number, pageSize: number, pages: number, data: Data<PersonRaw>[]): Paginated<Person> {
        return {
            page: page,
            pageSize: pageSize,
            pages: pages,
            data: data.map((d: Data<PersonRaw>) => this.getOne(d))
        };
    }
    
    getOne(data: Data<Person>): Person {
        console.log(data)
      return {
        id: data.id.toString(),
        name: data.attributes.name,
        surname: data.attributes.surname,
        email: data.attributes.email,
        birthdate: data.attributes.birthdate,
        groupId: typeof data.attributes.group === 'object' && data.attributes.group?.data
            ? data.attributes.group.data.id.toString()
            : undefined, // Verificación adicional para `group` y `data`
        gender: this.fromGenderMapping[data.attributes.gender]
      };
    }
  
    getAdded(data: PersonRaw):Person {
        return this.getOne(data.data);
    }
    getUpdated(data: PersonRaw):Person {
        return this.getOne(data.data);
    }
    getDeleted(data: PersonRaw):Person {
        return this.getOne(data.data);
    }
  }
  