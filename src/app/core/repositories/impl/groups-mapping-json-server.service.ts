import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Group } from "../../models/group.model";

export interface GroupRaw {
    id?: string;
    nombre: string;
    personas?: string[];  // Se añade el array de personas
}

@Injectable({
    providedIn: 'root'
})
export class GroupsMappingJsonServer implements IBaseMapping<Group> {
  
    setAdd(data: Group): GroupRaw {
        return {
            nombre: data.name,
            personas: data.personas || []  // Incluimos personas con un array vacío si no está definido
        };
    }

    setUpdate(data: Group): GroupRaw {
        let toReturn: any = {};
        Object.keys(data).forEach(key => {
            switch (key) {
                case 'name':
                    toReturn['nombre'] = data[key];
                    break;
                case 'personas':
                    toReturn['personas'] = data[key];  // Añadimos el array de personas
                    break;
                default:
            }
        });
        return toReturn;
    }

    getPaginated(page: number, pageSize: number, pages: number, data: GroupRaw[]): Paginated<Group> {
        return {
            page: page,
            pageSize: pageSize,
            pages: pages,
            data: data.map<Group>((d: GroupRaw) => this.getOne(d))
        };
    }

    getOne(data: GroupRaw): Group {
        return {
            id: data.id!,
            name: data.nombre,
            personas: data.personas || []  // Incluimos personas, o un array vacío si no está definido
        };
    }

    getAdded(data: GroupRaw): Group {
        return this.getOne(data);
    }

    getUpdated(data: GroupRaw): Group {
        return this.getOne(data);
    }

    getDeleted(data: GroupRaw): Group {
        return this.getOne(data);
    }
}
