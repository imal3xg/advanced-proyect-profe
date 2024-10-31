import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';  // Importar map para el filtro
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
  filteredPeople$: Observable<Person[]>;  // Observable para las personas filtradas
  totalPeople: number = 0;
  hasMorePeople: boolean = true;

  constructor(
    private animationCtrl: AnimationController,
    private peopleSvc: PeopleService,
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

  refresh() {
    this.page = 1;
    this.hasMorePeople = true;
    this.peopleSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Person>) => {
        this._people.next([...response.data]);
        this.totalPeople = response.data.length;
        this.page++;
        if (response.data.length < this.pageSize) {
          this.hasMorePeople = false;
        }
      }
    });
  }

  getMorePeople(notify: HTMLIonInfiniteScrollElement | null = null) {
    if (!this.hasMorePeople) {
      notify?.complete();
      return;
    }

    this.peopleSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Person>) => {
        this._people.next([...this._people.value, ...response.data]);
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

  async openPersonDetail(person: any, index: number) {
    await this.presentModalPerson('edit', person);
    this.selectedPerson = person;
  }

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

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.getMorePeople(ev.target);
  }

  private async presentModalPerson(mode: 'new' | 'edit', person: Person | undefined = undefined) {
    const modal = await this.modalCtrl.create({
      component: PersonModalComponent,
      componentProps: mode === 'edit' ? { person: person } : {}
    });
    modal.onDidDismiss().then((response: any) => {
      if (response.role === 'new') {
        this.peopleSvc.add(response.data).subscribe({
          next: () => {
            this.refresh();
            this.totalPeople++;
          },
          error: (err) => {}
        });
      } else if (response.role === 'edit') {
        this.peopleSvc.update(person!.id, response.data).subscribe({
          next: () => this.refresh(),
          error: (err) => {}
        });
      }
    });
    await modal.present();
  }

  async onAddPerson() {
    await this.presentModalPerson('new');
  }
}
