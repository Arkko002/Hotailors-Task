import {AzureFunction, Context, HttpRequest, HttpRequestQuery} from "@azure/functions";
import getContainer from "../ioc/inversify.config";
import { COMMON_TYPES } from "../ioc/commonTypes";
import { Logger } from "../commonServices/logger";
import { ILogger } from "../commonServices/iLogger";
import { IPokemonService } from "./services/IPokemonService";
import { Container } from "inversify";
import dotenv, {DotenvConfigOutput} from "dotenv";

const httpTrigger: AzureFunction = async (ctx: Context, req: HttpRequest): Promise<any> => {
    const container: Container = getContainer();
    const logger: Logger = container.get<ILogger>(COMMON_TYPES.ILogger) as Logger;
    logger.init(ctx, "1");

    logger.verbose(`HTTP Trigger called: ${req.method} | ${req.url}`);

    // Load environmental variables from .env file at app root dir
    const cfgResult: DotenvConfigOutput = dotenv.config();
    if (cfgResult.error) {
        logger.error(`Error during parsing of env variables: ${cfgResult.error}`);
        throw cfgResult.error;
    }

    const pokemonService: IPokemonService<HttpRequestQuery> =
        container.get<IPokemonService<HttpRequestQuery>>(COMMON_TYPES.IPokemonService);

    await pokemonService.processMessageAsync(req.query)
        .then((names) => {
            ctx.res = {
                body: names,
                status: 200,
                headers: { "Content-Type": "application/json" },
            };
        }).catch((err) => {
            ctx.res = {
                body: err,
                status: 500,
                headers: {"Content-Type": "application/json"},
            };
        });

    return ctx.res;
};

export default httpTrigger;
