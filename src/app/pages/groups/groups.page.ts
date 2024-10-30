import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, AnimationController, InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupModalComponent } from 'src/app/components/group-modal/group-modal.component';
import { Group } from 'src/app/core/models/group.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { GroupsService } from 'src/app/core/services/impl/groups.service';
import { MyGroupsService } from 'src/app/core/services/my-groups.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit {

  _groups:BehaviorSubject<Group[]> = new BehaviorSubject<Group[]>([]);
  groups$:Observable<Group[]> = this._groups.asObservable();
  totalGroups: number = 0;  // Nueva propiedad para el contador
  hasMoreGroups: boolean = true;

  constructor(
    private groupsSvc: GroupsService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController  // Inyectar AlertController
  ) {}

  ngOnInit(): void {
    this.getMoreGroups();
  }


  @ViewChildren('avatar') avatars!: QueryList<ElementRef>;
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef;
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef;

  selectedGroup: any = null;
  isAnimating = false;
  page:number = 1;
  pageSize:number = 25;

  refresh() {
    this.page = 1;
    this.hasMoreGroups = true;  // Reiniciar el flag al refrescar
    this.groupsSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Group>) => {
        this._groups.next([...response.data]);
        this.totalGroups = response.data.length;  // Actualizar el contador
        this.page++;

        // Verificar si no se obtuvieron datos suficientes para completar una página, es decir, si es el final
        if (response.data.length < this.pageSize) {
          this.hasMoreGroups = false;  // No quedan más grupos por cargar
        }
      }
    });
  }

  getMoreGroups(notify: HTMLIonInfiniteScrollElement | null = null) {
    // Verificar si hay más grupos que cargar antes de hacer la solicitud
    if (!this.hasMoreGroups) {
      notify?.complete();  // Detener el infinite scroll
      return;
    }
    this.groupsSvc.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Group>)=>{
        this._groups.next([...this._groups.value, ...response.data]);
        this.totalGroups = this._groups.value.length;  // Actualizar el contador
        this.page++;

        // Verificar si hemos llegado al final de los datos (menos grupos de los esperados)
        if (response.data.length < this.pageSize) {
          this.hasMoreGroups = false;  // No hay más personas por cargar
        }

        notify?.complete();  // Finalizar la animación del infinite scroll
      },
      error: (err) => {
        console.error('Error obteniendo más grupos:', err);
        notify?.complete();  // En caso de error, completar también el infinite scroll
      }
    });
  }

  async openGroupDetail(group: any, index: number) {
    await this.presentModalGroup('edit', group);
    this.selectedGroup = group;
  }

  async onDeleteGroup(group: Group) {
    // Crear una alerta de confirmación antes de eliminar
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar el grupo ${group.name}?`,
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
            this.groupsSvc.delete(group.id).subscribe({
              next: () => {
                const updatedGroup = this._groups.value.filter(g => g.id !== group.id);
                this._groups.next(updatedGroup);
                this.totalGroups = updatedGroup.length;  // Actualizar el contador
              },
              error: (err) => {
                console.error('Error eliminando grupo:', err);
              }
            });
          }
        }
      ]
    });

    // Presentar la alerta
    await alert.present();
  }

  onIonInfinite(ev:InfiniteScrollCustomEvent) {
    this.getMoreGroups(ev.target); 
  }

  private async presentModalGroup(mode: 'new' | 'edit', group: Group | undefined = undefined) {
    const modal = await this.modalCtrl.create({
      component: GroupModalComponent,
      componentProps: (mode == 'edit' ? {
        group: group
      } : {})
    });
    modal.onDidDismiss().then((response: any) => {
      switch (response.role) {
        case 'new':
          this.groupsSvc.add(response.data).subscribe({
            next: res => {
              this.refresh();  // Refrescar la lista para incluir el nuevo grupo
              this.totalGroups++;  // Incrementar el contador después de añadir
            },
            error: err => { }
          });
          break;
        case 'edit':
          this.groupsSvc.update(group!.id, response.data).subscribe({
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

  async onAddGroup() {
    await this.presentModalGroup('new');
  }
}
