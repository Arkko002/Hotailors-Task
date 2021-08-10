/**
 * Exposes functionality used by HttpTrigger function to process requests
 */
export interface IPokemonService<T> {
    processMessageAsync(msg: T): Promise<string[]>;
}
