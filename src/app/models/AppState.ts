import {DataState} from "../enums/DataState";

export interface AppState<T>{
    dataState: DataState;
    appData?: T;
    error?:string;
}