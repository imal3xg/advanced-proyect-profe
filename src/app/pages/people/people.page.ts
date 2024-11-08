import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';  // Importar map para el filtro
import { PersonModalComponent } from 'src/app/components/person-modal/person-modal.component';
import { Group } from 'src/app/core/models/group.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { Person } from 'src/app/core/models/person.model';
import { GroupsService } from 'src/app/core/services/impl/groups.service';
import { PeopleService } from 'src/app/core/services/impl/people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  _people: BehaviorSubject<Person[]> = new BehaviorSubject<Person[]>([]); // Almacena las personas
  people$: Observable<Person[]> = this._people.asObservable(); // Observable de personas
  filteredPeople$: Observable<Person[]>;  // Observable para las personas filtradas
  totalPeople: number = 0;
  hasMorePeople: boolean = true;

  constructor(
    private animationCtrl: AnimationController,
    private peopleSvc: PeopleService,
    private groupSvc: GroupsService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    // Inicializar el observable filtrado a todas las personas
    this.filteredPeople$ = this.people$;
  }

  ngOnInit(): void {
    this.getMorePeople();
  }

  @ViewChildren('avatar') avatars!: QueryList<ElementRef>;
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef;
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef;

  selectedPerson: any = null;
  isAnimating = false;
  page: number = 1;
  pageSize: number = 25;

  // Función para refrescar el listado de personas
  refresh() {
    this.page = 1;
    this.hasMorePeople = true;
    this.peopleSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Person>) => {
        const people = response.data.map(person => ({
          ...person,
          age: this.calculateAge(person.birthdate) // Calcular la edad al obtener las personas
        }));
        this._people.next([...people]);
        this.totalPeople = people.length;
        this.page++;
        if (response.data.length < this.pageSize) {
          this.hasMorePeople = false;
        }
      }
    });
  }

  // Función para obtener más personas de la API
  getMorePeople(notify: HTMLIonInfiniteScrollElement | null = null) {
    if (!this.hasMorePeople) {
      notify?.complete();
      return;
    }

    this.peopleSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Person>) => {
        const newPeople = response.data.map(person => ({
          ...person,
          age: this.calculateAge(person.birthdate) // Calcular la edad de cada persona
        }));
        this._people.next([...this._people.value, ...newPeople]);
        this.totalPeople = this._people.value.length;
        this.page++;
        if (response.data.length < this.pageSize) {
          this.hasMorePeople = false;
        }
        notify?.complete();
      },
      error: (err) => {
        console.error('Error obteniendo más personas:', err);
        notify?.complete();
      }
    });
  }

  // Función para calcular la edad en base a la fecha de nacimiento
  calculateAge(birthdate: string): number {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Función para filtrar personas por nombre o apellido
  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredPeople$ = this.people$.pipe(
      map((people) =>
        people.filter(
          (person) =>
            person.name.toLowerCase().includes(searchTerm) ||
            person.surname.toLowerCase().includes(searchTerm)
        )
      )
    );
  }

  // Función para abrir el modal de detalles de la persona
  async openPersonDetail(person: any, index: number) {
    await this.presentModalPerson('edit', person);
    this.selectedPerson = person;
  }

  // Función para eliminar a una persona
  async onDeletePerson(person: Person) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar a ${person.name} ${person.surname}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.peopleSvc.delete(person.id).subscribe({
              next: () => {
                const updatedPeople = this._people.value.filter((p) => p.id !== person.id);
                this._people.next(updatedPeople);
                this.totalPeople = updatedPeople.length;
              },
              error: (err) => {
                console.error('Error eliminando persona:', err);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // Función para manejar la carga infinita de personas
  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.getMorePeople(ev.target);
  }

  // Función para presentar el modal de agregar o editar una persona
  private async presentModalPerson(mode: 'new' | 'edit', person: Person | undefined = undefined) {
    // Obtener los grupos, ya sea con un método async como lastValueFrom o directamente en un observable
    let _groups: Group[] = await lastValueFrom(this.groupSvc.getAll()); 
  
    // Crear el modal con los grupos incluidos en las propiedades del componente
    const modal = await this.modalCtrl.create({
      component: PersonModalComponent,
      componentProps: mode === 'edit' ? { person: person, groups: _groups } : { groups: _groups }
    });
  
    // Cuando el modal se cierre, manejar el resultado
    modal.onDidDismiss().then((response: any) => {
      switch (response.role) {
        case 'new':
          // Si el rol es 'new', agregar la nueva persona
          this.peopleSvc.add(response.data).subscribe({
            next: () => {
              this.refresh(); // Refrescar la lista de personas
              this.totalPeople++; // Aumentar el total de personas
            },
            error: (err) => {
              console.error('Error al agregar persona', err);
            }
          });
          break;
  
        case 'edit':
          // Si el rol es 'edit', actualizar la persona
          this.peopleSvc.update(person!.id, response.data).subscribe({
            next: () => {
              this.refresh(); // Refrescar la lista de personas
            },
            error: (err) => {
              console.error('Error al actualizar persona', err);
            }
          });
          break;
  
        default:
          break;
      }
    });
  
    // Presentar el modal
    await modal.present();
  }
  

  // Función para agregar una nueva persona
  async onAddPerson() {
    await this.presentModalPerson('new');
  }
}
