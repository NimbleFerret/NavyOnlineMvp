export class Utils {

    public static readonly ERROR_EMAIL_EXISTS = 'EMAIL_EXISTS';
    public static readonly ERROR_EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND';
    public static readonly ERROR_WALLET_NOT_FOUND = 'WALLET_NOT_FOUND';
    public static readonly ERROR_WALLET_EXISTS = 'WALLET_EXISTS';
    public static readonly ERROR_BAD_SIGNATURE = 'BAD_SIGNATURE';
    public static readonly ERROR_BAD_AUTH = 'BAD_AUTH';
    public static readonly ERROR_BAD_PARAMS = 'BAD_PARAMS';
    public static readonly ERROR_BAD_EMAIL_OR_PASSWORD = 'BAD_EMAIL_OR_PASSWORD';

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