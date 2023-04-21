export class Utils {

    public static DeleteKeysFromMap(map: Map<String, any>, keys: String[]) {
        keys.forEach(key => {
            map.delete(key);
        });
    }

    public static GetBearerTokenFromRequest(request: Request) {
        if (request.headers['authorization']) {
            return request.headers['authorization'].split(' ')[1] as string;
        } else {
            return undefined;
        }
    }

}