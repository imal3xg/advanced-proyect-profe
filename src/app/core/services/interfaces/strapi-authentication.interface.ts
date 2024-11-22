
import { Observable } from "rxjs";
import { IAuthentication } from "./authentication.service";

export interface IStrapiAuthentication extends IAuthentication{
    getToken():string | null;
}
