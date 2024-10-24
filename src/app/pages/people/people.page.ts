import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersonModalComponent } from 'src/app/components/person-modal/person-modal.component';
import { Paginated } from 'src/app/core/models/paginated.model';
import { Person } from 'src/app/core/models/person.model';
import { PeopleService } from 'src/app/core/services/impl/people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  _people: BehaviorSubject<Person[]> = new BehaviorSubject<Person[]>([]);
  people$: Observable<Person[]> = this._people.asObservable();
  totalPeople: number = 0;  // Nueva propiedad para el contador
  hasMorePeople: boolean = true;

  constructor(
    private animationCtrl: AnimationController,
    private peopleSvc: PeopleService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController  // Inyectar AlertController
  ) {}

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

  refresh() {
    this.page = 1;
    this.hasMorePeople = true;  // Reiniciar el flag al refrescar
    this.peopleSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Person>) => {
        this._people.next([...response.data]);
        this.totalPeople = response.data.length;  // Actualizar el contador
        this.page++;

        // Verificar si no se obtuvieron datos suficientes para completar una página, es decir, si es el final
        if (response.data.length < this.pageSize) {
          this.hasMorePeople = false;  // No quedan más personas por cargar
        }
      }
    });
  }

  getMorePeople(notify: HTMLIonInfiniteScrollElement | null = null) {
    // Verificar si hay más personas que cargar antes de hacer la solicitud
    if (!this.hasMorePeople) {
      notify?.complete();  // Detener el infinite scroll
      return;
    }

    this.peopleSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Person>) => {
        this._people.next([...this._people.value, ...response.data]);
        this.totalPeople = this._people.value.length;  // Actualizar el contador
        this.page++;

        // Verificar si hemos llegado al final de los datos (menos personas de las esperadas)
        if (response.data.length < this.pageSize) {
          this.hasMorePeople = false;  // No hay más personas por cargar
        }

        notify?.complete();  // Finalizar la animación del infinite scroll
      },
      error: (err) => {
        console.error('Error obteniendo más personas:', err);
        notify?.complete();  // En caso de error, completar también el infinite scroll
      }
    });
  }

  async openPersonDetail(person: any, index: number) {
    await this.presentModalPerson('edit', person);
    this.selectedPerson = person;
  }

  async onDeletePerson(person: Person) {
    // Crear una alerta de confirmación antes de eliminar
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
          role: 'destructive',  // Marca como botón destructivo
          handler: () => {
            // Si el usuario confirma, se realiza la eliminación
            this.peopleSvc.delete(person.id).subscribe({
              next: () => {
                const updatedPeople = this._people.value.filter(p => p.id !== person.id);
                this._people.next(updatedPeople);
                this.totalPeople = updatedPeople.length;  // Actualizar el contador
              },
              error: (err) => {
                console.error('Error eliminando persona:', err);
              }
            });
          }
        }
      ]
    });

    // Presentar la alerta
    await alert.present();
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.getMorePeople(ev.target);
  }

  private async presentModalPerson(mode: 'new' | 'edit', person: Person | undefined = undefined) {
    const modal = await this.modalCtrl.create({
      component: PersonModalComponent,
      componentProps: (mode == 'edit' ? {
        person: person
      } : {})
    });
    modal.onDidDismiss().then((response: any) => {
      switch (response.role) {
        case 'new':
          this.peopleSvc.add(response.data).subscribe({
            next: res => {
              this.refresh();  // Refrescar la lista para incluir la nueva persona
              this.totalPeople++;  // Incrementar el contador después de añadir
            },
            error: err => { }
          });
          break;
        case 'edit':
          this.peopleSvc.update(person!.id, response.data).subscribe({
            next: res => {
              this.refresh();  // Refrescar la lista después de editar
            },
            error: err => { }
          });
          break;
        default:
          break;
      }
    });
    await modal.present();
  }

  async onAddPerson() {
    await this.presentModalPerson('new');
  }
}