import { Inject, Injectable } from "@angular/core";
import { IAuthentication } from "../interfaces/authentication.service";
import { BehaviorSubject, Observable } from "rxjs";
import { IAuthMapping } from "../interfaces/auth-mapping.interface";
import { User } from "../../models/auth.model";


@Injectable({
    providedIn: 'root'
  })
export abstract class BaseAuthenticationService implements IAuthentication{
    protected _authenticated:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public authenticated$:Observable<boolean> = this._authenticated.asObservable();

    protected _user:BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
    public user$:Observable<User | undefined> = this._user.asObservable();
    protected _ready:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public ready$:Observable<boolean> = this._ready.asObservable();
    constructor(
        protected authMapping:IAuthMapping
    ){

    }
    // Simula la verificación de si el usuario está autenticado
    isLoggedIn(): boolean {
        const token = localStorage.getItem('people-jwt-token'); // Puedes usar localStorage, sessionStorage o cualquier estrategia
        return token !== null && token !== ''; // Comprueba que el token no esté vacío
    }
    abstract getCurrentUser(): Promise<any>;
    abstract signIn(authPayload: any): Observable<any>;
    abstract signUp(registerPayload: any): Observable<any>;
    abstract signOut(): Observable<any>;
    abstract me():Observable<any>;
}