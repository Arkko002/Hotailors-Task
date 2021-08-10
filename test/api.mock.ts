import {IPokemonApi} from "../commonServices/iPokemonApi";
import IPokemon from "../models/IPokemon";
import {injectable} from "inversify";

@injectable()
export class ApiMock implements IPokemonApi {
    public get_pokemons_by_ids(ids: number[]): Promise<IPokemon[]> {
        const pokemon1: IPokemon = {id: 1, name: "bulbasaur", types: [{type: {name: "grass"}},
                {type: {name: "poison"}}]};
        const pokemon2: IPokemon = {id: 2, name: "ivysaur", types: [{type: {name: "grass"}}, {type: {name: "poison"}}]};
        const pokemon3: IPokemon = {id: 3, name: "venusaur", types: [{type: {name: "grass"}}
                , {type: {name: "poison"}}]};
        const pokemon4: IPokemon = {id: 4, name: "charmander", types: [{type: {name: "fire"}}]};

        return Promise.resolve([pokemon1, pokemon2, pokemon3, pokemon4]);
    }
}
