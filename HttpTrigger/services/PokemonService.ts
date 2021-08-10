import {inject, injectable} from "inversify";
import {IPokemonService} from "./IPokemonService";
import {COMMON_TYPES} from "../../ioc/commonTypes";
import {ILogger} from "../../commonServices/iLogger";
import {IPokemonApi} from "../../commonServices/iPokemonApi";
import {HttpRequestQuery} from "@azure/functions";
import IPokemon from "../../models/IPokemon";
import _ from "lodash";

/**
 * Implementation of IPokemonService that process request with data embedded in URL
 */
@injectable()
export class PokemonService implements IPokemonService<HttpRequestQuery> {
    @inject(COMMON_TYPES.ILogger)
    private readonly _logger: ILogger;

    @inject(COMMON_TYPES.IPokemonApi)
    private readonly _api: IPokemonApi;

    // @ts-ignore
    public async processMessageAsync(msg: HttpRequestQuery): Promise<string[]> {
        this._logger.info(`Started processing query - ID: ${msg.id} | Type: ${msg.type}`);

        if (!this.isValidQuery(msg)) {
            return Promise.resolve([]);
        }

        // Remove trailing empty strings with truthy filter, map filtered strings to number
        const ids: number[] = msg.id.split(",").filter((e) => e).map(Number);

        let names: string[];
        await this._api.get_pokemons_by_ids(ids)
            .then((pokemons) => {
                names = this.filterNamesByType(pokemons, msg.type);
            }).catch((err) => {
                this._logger.error(`Couldn't process query because of API error: ${err}`);
            });

        return Promise.resolve(names);
    }

    /**
     * Checks if all parameters necessary for operation are present in query
     * @param query
     * @private
     */
    private isValidQuery(query: HttpRequestQuery): boolean {
        return !!query.type || !!query.id;
    }

    /**
     * Filters pokemons based on provided type, and returns their names
     * @param pokemons
     * @param searchedType
     * @private
     */
    private filterNamesByType(pokemons: IPokemon[], searchedType: string): string[] {
        const filtered: IPokemon[] = _.filter(pokemons, (p) => {
            return !!_.find(p.types, (types) => {
                if (types.type.name === searchedType) {
                    return types;
                }
            });
        });

        return _.map(filtered, (p) => p.name);
    }
}
