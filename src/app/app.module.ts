import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Servicios y repositorios
import { GroupsRepositoryFactory, PeopleRepositoryFactory } from './core/repositories/repository.factory';
import { PeopleService } from './core/services/impl/people.service';
import { GroupsService } from './core/services/impl/groups.service';

// Tokens para inyección de dependencias
import { 
  GROUPS_API_URL_TOKEN, 
  GROUPS_REPOSITORY_MAPPING_TOKEN, 
  GROUPS_RESOURCE_NAME_TOKEN, 
  PEOPLE_API_URL_TOKEN, 
  PEOPLE_REPOSITORY_MAPPING_TOKEN, 
  PEOPLE_RESOURCE_NAME_TOKEN 
} from './core/repositories/repository.tokens';

// Mapeos para los repositorios
import { PeopleMappingStrapiService } from './core/repositories/impl/people-mapping-strapi.service';
import { GroupsMappingStrapiService } from './core/repositories/impl/groups-mapping-strapi.service';

// Componentes
import { PersonModalComponent } from './components/person-modal/person-modal.component';
import { GroupSelectableComponent } from './components/group-selectable/group-selectable.component';
import { GroupModalComponent } from './components/group-modal/group-modal.component';

// Módulos adicionales
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { PeopleLocalStorageMapping } from './core/repositories/impl/people-mapping-local-storage.service';
import { PeopleMappingJsonServer } from './core/repositories/impl/people-mapping-json-server.service';
import { GroupsMappingJsonServer } from './core/repositories/impl/groups-mapping-json-server.service';

@NgModule({
  declarations: [AppComponent, PersonModalComponent, GroupModalComponent, GroupSelectableComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    
    { provide: PEOPLE_RESOURCE_NAME_TOKEN, useValue: 'people' },
    { provide: GROUPS_RESOURCE_NAME_TOKEN, useValue: 'groups' },
    { provide: PEOPLE_API_URL_TOKEN, useValue: 'http://localhost:1337/api' },
    { provide: GROUPS_API_URL_TOKEN, useValue: 'http://localhost:1337/api' },
    // Registrar los repositorios
    { 
      provide: PEOPLE_REPOSITORY_MAPPING_TOKEN, 
      useClass: PeopleMappingStrapiService
    },
    { 
      provide: GROUPS_REPOSITORY_MAPPING_TOKEN, 
      useClass: GroupsMappingStrapiService
    },
    PeopleRepositoryFactory,
    GroupsRepositoryFactory,
    // Registrar otros repositorios según sea necesario
    // Servicios de aplicación
    {
      provide: 'PeopleService',
      useClass: PeopleService
    },
    {
      provide: 'GroupsService',
      useClass: GroupsService
    }
    // ... otros proveedores],

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}