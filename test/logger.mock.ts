import {ILogger} from "../commonServices/iLogger";
import {injectable} from "inversify";

@injectable()
export class LoggerMock implements ILogger {
    public error(message: string): void {
        return;
    }

    public info(message: string): void {
        return;
    }

    public verbose(message: string): void {
        return;
    }

    public warn(message: string): void {
        return;
    }

}
