import "reflect-metadata";
import { Container } from "inversify";
import { COMMON_TYPES } from "./commonTypes";

import { Logger } from "../commonServices/logger";
import { ILogger } from "../commonServices/iLogger";
import { IPokemonService } from "../HttpTrigger/services/IPokemonService";
import { PokemonService } from "../HttpTrigger/services/PokemonService";
import { IPokemonApi } from "../commonServices/iPokemonApi";
import { PokemonApi } from "../commonServices/pokemonApi";
import {HttpRequestQuery} from "@azure/functions";

const getContainer: (() => Container) = (): Container => {
    const container: Container = new Container();

    container
        .bind<ILogger>(COMMON_TYPES.ILogger)
        .to(Logger)
        .inSingletonScope();

    container
        .bind<IPokemonService<HttpRequestQuery>>(COMMON_TYPES.IPokemonService)
        .to(PokemonService);

    container
        .bind<IPokemonApi>(COMMON_TYPES.IPokemonApi)
        .to(PokemonApi);

    return container;
};

export default getContainer;
