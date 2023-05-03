import { Logger } from "@nestjs/common";
import { join } from "path";

const fs = require('fs');

export class FileUtils {

    public static LoadFixture(serviceName: string, fixtureName: string, callback: Function) {
        try {
            fs.readFile(join(__dirname, '..', serviceName) + '/fixtures/' + fixtureName, async (error: any, data: any) => {
                if (error) {
                    Logger.error('Unable to load ' + fixtureName + ' fixture!', error);
                } else {
                    const fixture = JSON.parse(data);
                    Logger.log(fixtureName + ' loaded!');
                    callback(fixture);
                }
            });
        } catch (error) {
            Logger.error('Unable to load ' + fixtureName + ' fixture!', error);
        }
    }

}