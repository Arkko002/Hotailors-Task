import axios, { AxiosError, AxiosInstance } from "axios";
import { IPokemonApi } from "./iPokemonApi";
import IPokemon from "../models/IPokemon";
import { ILogger } from "./iLogger";
import {inject, injectable} from "inversify";
import { COMMON_TYPES } from "../ioc/commonTypes";

/**
 * Implementation of IPokemonApi based on Axios.
 */
@injectable()
export class PokemonApi implements IPokemonApi {

    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;
    private readonly _api: AxiosInstance;

    constructor() {
        // Setup Axios instance with error logging through interceptors
        this._api = axios.create({
            baseURL: process.env.POKEMON_API_URL,
        });

        this._api.interceptors.request.use((req) => {
            this._logger.verbose(`API request: ${req.method} | ${req.baseURL + req.url}`);
            return req;
            }, (error) => {
            this._logger.error(`Error during API request: ${error}`);
            return Promise.reject(error);
        });

        this._api.interceptors.response.use((res) => {
            this._logger.verbose(`API response: ${res.request.method} | ${res.request.baseURL + res.request.url} | ${res.status}`);
            return res;
            }, (error) => {
            this._logger.error(`Error during API response: ${error}`);
            return Promise.reject(error);
        });
    }

    public async get_pokemons_by_ids(ids: number[]): Promise<IPokemon[]> {
        const pokemons: IPokemon[] = [];

        for (const id of ids) {
            await this._api.get<IPokemon>(`pokemon/${id}`)
                .then((res) => {
                    pokemons.push(res.data);
                })
                .catch((err) => { return; });
        }

        if (pokemons.length === 0) {
            return  Promise.reject();
        }

        return Promise.resolve(pokemons);
    }
}
