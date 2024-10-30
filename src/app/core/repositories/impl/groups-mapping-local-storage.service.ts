import { Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Group } from "../../models/group.model";

interface GroupRaw {
  id: string;
  nombre: string;           // Campo 'nombre' en GroupRaw
  personas?: string[];       // Agregado para manejar la lista de personas
}

@Injectable({
  providedIn: 'root'
})
export class GroupsMappingLocalStorageService implements IBaseMapping<Group> {

  setAdd(data: Group) {
    throw new Error("Method not implemented.");
  }

  setUpdate(data: any) {
    throw new Error("Method not implemented.");
  }

  getPaginated(page: number, pageSize: number, pages: number, data: GroupRaw[]): Paginated<Group> {
    return {
      page: page,
      pageSize: pageSize,
      pages: pages,
      data: data.map<Group>((d: GroupRaw) => {
        return this.getOne(d);
      })
    };
  }

  getOne(data: GroupRaw): Group {
    return {
      id: data.id,
      name: data.nombre,            // Cambiado 'nombre' a 'name' para coincidir con la interfaz Group
      personas: data.personas || [] // Asigna un array vacío si personas es undefined
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
