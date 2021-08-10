import {PokemonService} from "../HttpTrigger/services/PokemonService";
import {HttpRequestQuery} from "@azure/functions";
import {Container} from "inversify";
import {COMMON_TYPES} from "../ioc/commonTypes";
import {ApiMock} from "./api.mock";
import getContainer from "../ioc/inversify.config";
import {LoggerMock} from "./logger.mock";
import { assert, should } from "chai";
import _ from "lodash";
import IPokemon from "../models/IPokemon";

describe("PokemonService", () => {
    let service: PokemonService;
    let api: ApiMock;
    let container: Container;

    beforeEach(() => {
        service = new PokemonService();
        api = new ApiMock();

        container = getContainer();
        container.unbind(COMMON_TYPES.ILogger);
        container.bind(COMMON_TYPES.ILogger).to(LoggerMock);

        container.unbind(COMMON_TYPES.IPokemonApi);
        container.bind(COMMON_TYPES.IPokemonApi).to(ApiMock);
    });

    afterEach(() => {
        container = null;
    });

    describe("#processMessageAsync()", () => {
        it("should return a list of pokemons on multiple ids and type", () => {
            const query: HttpRequestQuery = {id: "1", type: "poison" };
            let mockPokemons: IPokemon[];
            api.get_pokemons_by_ids([1, 2, 3 , 4]).then((pokemons) => mockPokemons = pokemons);

            service.processMessageAsync(query).then((res) => {
                assert(_.includes(res, mockPokemons[1].name));
            });
        });

        it("should return an empty list on invalid id", () => {
            const query: HttpRequestQuery = {id: "-99", type: "poison"};

            service.processMessageAsync(query).then((res) => {
                should().equal(res.length, 0);
            });
        });

        it("should return an empty list on invalid type", () => {
            const query: HttpRequestQuery = {id: "1", type: "notAType123"};

            service.processMessageAsync(query).then((res) => {
                should().equal(res.length, 0);
            });
        });

        it("should return an empty list when type missing", () => {
            const query: HttpRequestQuery = {id: "1"};

            service.processMessageAsync(query).then((res) => {
                should().equal(res.length, 0);
            });
        });

        it("should return an empty list when ids missing", () => {
            const query: HttpRequestQuery = {type: "poison"};

            service.processMessageAsync(query).then((res) => {
                should().equal(res.length, 0);
            });
        });
    });
});
