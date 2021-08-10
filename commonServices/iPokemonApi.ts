import IPokemon from "../models/IPokemon";

/**
 * Presents operations necessary for retrieving data from PokeApi
 * and hides underlying concrete implementation
 */
export interface IPokemonApi {
    get_pokemons_by_ids(ids: number[]): Promise<IPokemon[]>;
}
