import {IType} from "./IType";

/**
 * Neccessary for Axios typechecking, as PokeApi stores types in a wrapper list
 */
export default interface ITypes {
    type: IType;
}
