// src/app/app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationServiceFactory, AuthMappingFactory, GroupsMappingFactory, GroupsRepositoryFactory, PeopleMappingFactory, PeopleRepositoryFactory } from './core/repositories/repository.factory';
import { PeopleService } from './core/services/impl/people.service';
import { AUTH_MAPPING_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, GROUPS_API_URL_TOKEN, GROUPS_REPOSITORY_MAPPING_TOKEN, GROUPS_RESOURCE_NAME_TOKEN, PEOPLE_API_URL_TOKEN, PEOPLE_REPOSITORY_MAPPING_TOKEN, PEOPLE_RESOURCE_NAME_TOKEN, UPLOAD_API_URL_TOKEN } from './core/repositories/repository.tokens';
import { provideHttpClient } from '@angular/common/http';
import { PeopleLocalStorageMapping } from './core/repositories/impl/people-mapping-local-storage.service';
import { PeopleMappingJsonServer } from './core/repositories/impl/people-mapping-json-server.service';
import { GroupsMappingJsonServer } from './core/repositories/impl/groups-mapping-json-server.service';
import { GroupsService } from './core/services/impl/groups.service';
import { ReactiveFormsModule } from '@angular/forms';
import { PeopleMappingStrapiService } from './core/repositories/impl/people-mapping-strapi.service';
import { GroupsMappingStrapiService } from './core/repositories/impl/groups-mapping-strapi.service';
import { StrapiAuthMappingService } from './core/services/impl/strapi-auth-mapping.service';
import { StrapiAuthenticationService } from './core/services/impl/strapi-authentication.service';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PersonModalComponent } from './components/person-modal/person-modal.component';
import { GroupModalComponent } from './components/group-modal/group-modal.component';
import { GroupSelectableComponent } from './components/group-selectable/group-selectable.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonModalComponent,
    GroupModalComponent,
    GroupSelectableComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    provideHttpClient(),
    { provide: BACKEND_TOKEN, useValue: 'strapi' },
    { provide: PEOPLE_RESOURCE_NAME_TOKEN, useValue: 'people' },
    { provide: GROUPS_RESOURCE_NAME_TOKEN, useValue: 'groups' },
    { provide: PEOPLE_API_URL_TOKEN, useValue: 'http://localhost:1337/api' },
    { provide: GROUPS_API_URL_TOKEN, useValue: 'http://localhost:1337/api' },
    { provide: AUTH_SIGN_IN_API_URL_TOKEN, useValue: 'http://localhost:1337/api/auth/local' },
    { provide: AUTH_SIGN_UP_API_URL_TOKEN, useValue: 'http://localhost:1337/api/auth/local/register' },
    { provide: AUTH_ME_API_URL_TOKEN, useValue: 'http://localhost:1337/api/users/me' },
    { provide: UPLOAD_API_URL_TOKEN, useValue: 'http://localhost:1337/api/upload' },
    
    PeopleMappingFactory,
    GroupsMappingFactory,
    AuthMappingFactory,
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
    },
    AuthenticationServiceFactory,

    // ... otros proveedores],

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}