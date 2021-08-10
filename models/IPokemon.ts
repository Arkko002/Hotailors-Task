import IType from "./ITypes";
import {injectable} from "inversify";

/**
 * Pokemon model with removed details unrelated to our service functionality
 */
export default interface IPokemon {
    id: number;
    name: string;
    types: IType[];
}
